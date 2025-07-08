import json
import spacy
from collections import defaultdict

# Load spaCy English model
nlp = spacy.load('en_core_web_sm')

# Load scraped data
with open('output.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

nodes = set()
edges = []

# Helper: Add node
def add_node(entity):
    if entity:
        nodes.add(entity)

# Helper: Add edge
def add_edge(src, rel, tgt):
    if src and tgt and rel:
        edges.append({'source': src, 'relation': rel, 'target': tgt})

# Rule-based relationship extraction (very basic)
def extract_relationships(text, title, url):
    doc = nlp(text)
    ents = [ent.text for ent in doc.ents]
    for ent in ents:
        add_node(ent)
    # Example: If title is a satellite, relate to ISRO
    if 'ISRO' in text or 'ISRO' in title:
        add_edge(title, 'operated_by', 'ISRO')
    # Example: If 'payload' in text, relate payloads
    if 'payload' in text.lower():
        for ent in ents:
            if 'Payload' in ent or 'payload' in ent:
                add_edge(title, 'has_payload', ent)
    # Example: If a date is found, relate to launch
    for ent in doc.ents:
        if ent.label_ == 'DATE':
            add_edge(title, 'has_event_date', ent.text)
    # Example: If a location is found, relate to location
    for ent in doc.ents:
        if ent.label_ == 'GPE':
            add_edge(title, 'located_in', ent.text)
    # Example: If a document is linked, relate to document
    if url:
        add_edge(title, 'has_page', url)

# Main extraction loop
for entry in data:
    title = entry.get('title', '')
    url = entry.get('url', '')
    content1 = entry.get('content1', '')
    content2 = entry.get('content2', '')
    tables = entry.get('tables', [])
    docLinks = entry.get('docLinks', [])
    meta = entry.get('meta', {})

    add_node(title)
    extract_relationships(content1, title, url)
    extract_relationships(content2, title, url)
    # Table extraction: treat first column as entity, rest as attributes
    for table in tables:
        for row in table:
            if len(row) > 1:
                add_node(row[0])
                for col in row[1:]:
                    add_edge(row[0], 'has_attribute', col)
    # Document links
    for doc_url in docLinks:
        add_edge(title, 'has_document', doc_url)
    # Meta tags
    for k, v in meta.items():
        add_edge(title, f'has_meta_{k}', v)

# Output knowledge graph
kg = {
    'nodes': list(nodes),
    'edges': edges
}

with open('knowledge_graph.json', 'w', encoding='utf-8') as f:
    json.dump(kg, f, indent=2, ensure_ascii=False)

print('Knowledge graph saved to knowledge_graph.json') 