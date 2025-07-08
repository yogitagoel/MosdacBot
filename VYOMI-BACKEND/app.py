import streamlit as st
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import spacy
import numpy as np
from sentence_transformers import SentenceTransformer
from fuzzywuzzy import fuzz
import re

def render_doc_links(text, kg):
    # Find all URLs in the text
    urls = re.findall(r'(https?://\S+)', text)
    doc_urls = set()
    doc_previews = kg.get('doc_previews', {})
    for edge in kg['edges']:
        if edge['relation'] == 'has_document':
            doc_urls.add(edge['target'])
    for url in urls:
        if url in doc_urls:
            filename = url.split('/')[-1]
            preview = doc_previews.get(url, "Official document from MOSDAC/ISRO")
            text = text.replace(
                url,
                f'<a href="{url}" target="_blank" style="color:#00bcd4;text-decoration:underline;font-weight:500;">{filename}</a> <span style="font-size:0.95em;color:#444;">({preview})</span>'
            )
    return text

# Load API key from .env
load_dotenv()
genai.configure(api_key="")

# Load knowledge graph
with open('knowledge_graph.json', 'r', encoding='utf-8') as f:
    kg = json.load(f)

# Load spaCy for simple keyword/entity extraction
nlp = spacy.load('en_core_web_sm')

# Load sentence-transformers model for semantic search
sbert_model = SentenceTransformer('all-MiniLM-L6-v2')

# Precompute edge texts and embeddings for semantic search
edge_texts = [f"{e['source']} {e['relation']} {e['target']}" for e in kg['edges']]
edge_embeddings = sbert_model.encode(edge_texts, show_progress_bar=False)

def retrieve_kg_context_semantic(query, kg, max_results=5, fuzzy_threshold=80):
    # Semantic search
    query_emb = sbert_model.encode([query])[0]
    sims = np.dot(edge_embeddings, query_emb) / (np.linalg.norm(edge_embeddings, axis=1) * np.linalg.norm(query_emb) + 1e-8)
    top_idx = np.argsort(sims)[::-1][:max_results]
    context_edges = [kg['edges'][i] for i in top_idx if sims[i] > 0.3]  # similarity threshold

    # Fuzzy entity linking (fallback if not enough semantic matches)
    if len(context_edges) < max_results:
        for i, e in enumerate(kg['edges']):
            score = max(
                fuzz.partial_ratio(query.lower(), str(e['source']).lower()),
                fuzz.partial_ratio(query.lower(), str(e['target']).lower()),
                fuzz.partial_ratio(query.lower(), str(e['relation']).lower())
            )
            if score >= fuzzy_threshold and kg['edges'][i] not in context_edges:
                context_edges.append(kg['edges'][i])
            if len(context_edges) >= max_results:
                break
    return context_edges[:max_results]

# Custom CSS for Vyomi branding
st.markdown('''
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@500&display=swap');
    html, body, [class*="css"]  {
        font-family: 'Rajdhani', 'Orbitron', sans-serif;
        background: #f7fcff;
        color: #222;
    }
    .vyomi-logo {
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 1.5rem;
    }
    .vyomi-logo svg {
        height: 40px; width: 40px;
        margin-right: 0.75rem;
    }
    .vyomi-title {
        font-family: 'Orbitron', 'Rajdhani', sans-serif;
        font-size: 2rem;
        color: #00bcd4;
        letter-spacing: 2px;
        font-weight: 700;
    }
    </style>
''', unsafe_allow_html=True)

# Logo SVG (same as landing)
logo_svg = '''<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="28" stroke="#00bcd4" stroke-width="4"/>
<ellipse cx="32" cy="32" rx="20" ry="6" stroke="#ff9933" stroke-width="2" fill="none"/>
<rect x="28" y="18" width="8" height="28" rx="4" fill="#007c91"/>
<circle cx="32" cy="18" r="4" fill="#fff" stroke="#00bcd4" stroke-width="2"/>
<circle cx="32" cy="46" r="4" fill="#138808" stroke="#00bcd4" stroke-width="2"/>
</svg>'''

# Gemini model instance
MODEL_NAME = "models/gemini-2.0-flash-001"
model = genai.GenerativeModel(MODEL_NAME)

st.set_page_config(page_title="Vyomi - India's Space Knowledge AI", layout="centered")
st.markdown(f'''<div class="vyomi-logo">{logo_svg}<span class="vyomi-title">Vyomi</span></div>''', unsafe_allow_html=True)
st.subheader("India’s Space Knowledge AI Assistant")

# System message for Sia's persona
SIA_PROMPT = (
    "You are Sia, a helpful, concise, and friendly AI assistant. "
    "Always answer clearly and accurately. Be human-like, polite, and supportive. "
    "If you're unsure, say so honestly."
)

# Setup chat history
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Show previous messages
for message in st.session_state.chat_history:
    with st.chat_message(message["role"]):
        st.write(message["content"])

# Chat input
user_input = st.chat_input("Ask Vyomi something...")

if user_input:
    # Show user message
    st.session_state.chat_history.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.write(user_input)

    # Retrieve KG context (semantic + fuzzy)
    kg_context = retrieve_kg_context_semantic(user_input, kg)
    context_str = "\n".join([
        f"[{e['source']}] --{e['relation']}--> [{e['target']}]" for e in kg_context
    ])
    if context_str:
        st.info(f"**Knowledge Graph Context:**\n{context_str}")

    with st.chat_message("assistant"):
        with st.spinner("Vyomi is thinking..."):
            try:
                # Build conversation context with KG context
                context_prompt = SIA_PROMPT
                if context_str:
                    context_prompt += f"\n\nRelevant context from knowledge graph:\n{context_str}"
                parts = [{"role": "user", "parts": [context_prompt]}] + [
                    {"role": msg["role"], "parts": [msg["content"]]}
                    for msg in st.session_state.chat_history
                ]

                response = model.generate_content(contents=parts)
                reply = response.text
            except Exception as e:
                reply = f"❌ Error: {str(e)}"
            # Render document links in the reply
            st.markdown(render_doc_links(reply, kg), unsafe_allow_html=True)

    st.session_state.chat_history.append({"role": "assistant", "content": reply})

# Sidebar controls
with st.sidebar:
    st.markdown(f'''<div class="vyomi-logo">{logo_svg}<span class="vyomi-title">Vyomi</span></div>''', unsafe_allow_html=True)
    st.title("Options")
    if st.button("Clear Chat History"):
        st.session_state.chat_history = []
        st.rerun()

    st.markdown(f"""
    **Vyomi's Config:**
    - Model: `{MODEL_NAME}`  
    - SDK: `google-generativeai`  
    - Role: India's Space Knowledge AI  
    """)
