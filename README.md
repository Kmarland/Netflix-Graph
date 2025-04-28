# Netflix Actor/TV Show Force Directed Graph

This project is an interactive **D3.js** visualization that displays data from Netflix's 2020/2021 catalog. It presents a **force-directed graph** showing actor/acted-in relationships, where each node represents an actor or a TV show. The edges between nodes represent the connection of an actor to the TV shows they’ve appeared in.

## Features

- 🎭 **Interactive Force-Directed Graph**: 
  - Nodes represent actors or TV shows.
  - Edges connect actors to TV shows they’ve appeared in.
- 🖱️ **Hover over nodes** to see information about the selected actor or TV show, including names, roles, and other details.
- 🔍 **Search Functionality**: 
  - Users can search for specific actors or TV shows using the search bar.

## How to Use

1. **Load the page** — A force-directed graph will appear, showing nodes (actors and TV shows) connected by edges.
2. **Hover over any node** to view more information about the actor or TV show.
3. 2. **Click anywhere** to unhighlight the hovered node and it neighbors.
4. **Use the search bar** at the top to find a specific actor or TV show. Type a name, and the graph will filter the nodes to display the search result.

## Data Source

This visualization uses Netflix data from the 2020/2021 catalog, including actor/TV show relationships. The data is processed and visualized using D3.js, creating an interactive network.
