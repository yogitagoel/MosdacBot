import json
from pyvis.network import Network

# Load the knowledge graph
with open('knowledge_graph.json', 'r', encoding='utf-8') as f:
    kg = json.load(f)

# Create a PyVis network
net = Network(height='800px', width='100%', bgcolor='#222222', font_color='cyan', notebook=False, directed=True)

# Track added nodes
added_nodes = set()

# Add nodes from the node list
for node in kg['nodes']:
    net.add_node(node, label=node, color='cyan', font={'size': 18, 'face': 'Arial Black'})
    added_nodes.add(node)

# Add edges, ensuring both source and target nodes exist
for edge in kg['edges']:
    src = edge['source']
    tgt = edge['target']
    # Add missing nodes on the fly
    if src not in added_nodes:
        net.add_node(src, label=src, color='orange', font={'size': 16})
        added_nodes.add(src)
    if tgt not in added_nodes:
        net.add_node(tgt, label=tgt, color='orange', font={'size': 16})
        added_nodes.add(tgt)
    net.add_edge(src, tgt, label=edge['relation'], color='lightblue')

# Set physics layout
net.barnes_hut()

# Save to HTML
net.write_html('kg_visualization.html')
print('Knowledge graph visualization saved to kg_visualization.html') 