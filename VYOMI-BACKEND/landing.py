import streamlit as st
import json
import base64

# Custom CSS for fonts and theme
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
        height: 64px; width: 64px;
        margin-right: 1rem;
    }
    .vyomi-title {
        font-family: 'Orbitron', 'Rajdhani', sans-serif;
        font-size: 2.5rem;
        color: #00bcd4;
        letter-spacing: 2px;
        font-weight: 700;
    }
    .vyomi-tagline {
        font-size: 1.2rem;
        color: #007c91;
        margin-bottom: 2rem;
    }
    .doc-link {
        color: #00bcd4;
        text-decoration: underline;
        font-weight: 500;
    }
    .doc-preview {
        font-size: 0.95rem;
        color: #444;
        margin-bottom: 0.5rem;
    }
    </style>
''', unsafe_allow_html=True)

# Logo SVG (minimal satellite + orbit arc + tricolor accent)
logo_svg = '''<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32" cy="32" r="28" stroke="#00bcd4" stroke-width="4"/>
<ellipse cx="32" cy="32" rx="20" ry="6" stroke="#ff9933" stroke-width="2" fill="none"/>
<rect x="28" y="18" width="8" height="28" rx="4" fill="#007c91"/>
<circle cx="32" cy="18" r="4" fill="#fff" stroke="#00bcd4" stroke-width="2"/>
<circle cx="32" cy="46" r="4" fill="#138808" stroke="#00bcd4" stroke-width="2"/>
</svg>'''

st.markdown(f'''<div class="vyomi-logo">{logo_svg}<span class="vyomi-title">Vyomi</span></div>''', unsafe_allow_html=True)
st.markdown('<div class="vyomi-tagline">India’s Space Knowledge AI Assistant</div>', unsafe_allow_html=True)

st.write("""
Vyomi is your friendly, fast, and contextual AI assistant for all things Indian space and satellites. Powered by a knowledge graph and the latest AI, Vyomi helps you:
- Instantly retrieve facts about Indian satellites, missions, and payloads
- Search and preview official documents and data
- Get contextual, human-like answers to your questions
- Explore India's space achievements with ease
""")

st.header("Features")
st.markdown("""
- **Conversational AI**: Ask anything about Indian satellites, ISRO, or MOSDAC data
- **Knowledge Graph**: Contextual, relationship-based information
- **Document Search**: Find and preview/download official docs (PDF, XLSX, etc.)
- **Modern UI**: Minimal, fast, and beautiful
- **Inspired by ISRO & India**: Colors, logo, and fonts reflect Indian space pride
""")

st.header("Try Vyomi Chatbot")
if st.button("Open Chatbot 🤖"):
    st.switch_page("app.py")

st.header("Search & Download Documents")

# Load docLinks from knowledge_graph.json
def get_doc_links():
    with open('knowledge_graph.json', 'r', encoding='utf-8') as f:
        kg = json.load(f)
    docs = set()
    for edge in kg['edges']:
        if edge['relation'] == 'has_document':
            docs.add(edge['target'])
    return sorted(list(docs))

doc_links = get_doc_links()
search = st.text_input("Search documents (by filename or keyword)")

filtered_docs = [d for d in doc_links if search.lower() in d.lower()]

for doc_url in filtered_docs:
    filename = doc_url.split('/')[-1]
    st.markdown(f'<a class="doc-link" href="{doc_url}" target="_blank">{filename}</a>', unsafe_allow_html=True)
    # Optionally, show a preview/summary if available (could use knowledge graph meta or content)
    # For now, just show the filename and link
    st.markdown(f'<div class="doc-preview">Official document from MOSDAC/ISRO</div>', unsafe_allow_html=True)

st.markdown("<hr style='margin-top:2rem;margin-bottom:1rem;border:1px solid #00bcd4;' />", unsafe_allow_html=True)
st.write("""
Vyomi is an open, modular project inspired by India's space journey. 
Proudly built with ❤️ by the community.
""") 