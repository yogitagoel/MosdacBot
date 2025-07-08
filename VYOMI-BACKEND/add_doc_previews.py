import json

with open('knowledge_graph.json', 'r', encoding='utf-8') as f:
    kg = json.load(f)

doc_previews = {}
for edge in kg['edges']:
    if edge['relation'] == 'has_document':
        doc_url = edge['target']
        # Try to find a related node or meta for preview
        preview = None
        for e2 in kg['edges']:
            if e2['source'] == edge['source'] and e2['relation'].startswith('has_meta_'):
                preview = e2['target']
                break
        if not preview:
            preview = f"Official document from {edge['source']}"
        doc_previews[doc_url] = preview

kg['doc_previews'] = doc_previews

with open('knowledge_graph.json', 'w', encoding='utf-8') as f:
    json.dump(kg, f, indent=2, ensure_ascii=False)