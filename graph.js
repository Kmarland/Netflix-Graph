var nodes, links, nodeGroup;
let link, node;
var width = 900;
var height = 700;

var svgGraph = d3.select('#graph');

document.addEventListener("click", function(event) {
    if (!event.target.closest(".graph-node")) {
        nodeGroup.style("filter", null);
        nodeGroup.select("text").style("display", "none");
        link.style("filter", null);
        d3.select("#actorBlurb").html("");
    }
});

d3.json('data.json').then(function(data) {
    nodes = data.nodes;
    links = data.links;
    const color = d3.scaleOrdinal(["Actor", "TV Show"], ["#1576cb", "#15cb5d"])
    const size = d3.scaleOrdinal(["Actor", "TV Show"], [8, 15])

    const datalist = d3.select("#nodeNames");
    const sortedNodes = [...nodes].sort((a, b) => a.name.localeCompare(b.name));
    sortedNodes.forEach(n => {
        datalist.append("option")
            .attr("value", n.name);
    });

    d3.select("#search").on("input", function() {
        const inputValue = this.value;
        const matchedNode = nodes.find(n => n.name === inputValue);
        if (matchedNode) {
            highlight(matchedNode);
        }
    });

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.name).distance(50).strength(1.5))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(0, 0))
        .force("radial", d3.forceRadial(100, 0, 0).strength(0.35))
        .on("tick", ticked);

    const svg = d3.select("#graph")
        .attr("viewBox", [-900, -850, 1800, 1700])
        .attr("width", width)
        .attr("height", height);

    link = svg.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1.5)
            .attr("stroke-linecap", "round");

    nodeGroup = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("class", "graph-node-group");

    nodeGroup.append("circle")
        .attr("r", d => size(d.type))
        .attr("fill", d => color(d.type))
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 1.5)
        .attr("class", "graph-node")
        .on("mouseover", function(event, d) {
            //d3.select(this.parentNode).select("text").style("display", "block");
            highlight(d);
        })
        .on("mouseout", function(event, d) {
            //d3.select(this.parentNode).select("text").style("display", "none");
        })
        .on("click", function(event, d) {
            event.stopPropagation();
        });

    nodeGroup.append("text")
        .text(d => d.name)
        .attr("class", "nametext")
        .attr("transform", "translate(10, -10)")
        .style("font-size", "28px")
        .style("display", "none");

    simulation.stop();
    for (let i = 0; i < 100; ++i) simulation.tick();
    ticked();
});

function highlight(d) {
    nodeGroup.style("filter", "opacity(0.3)");
    link.style("filter", "opacity(0.3)");

    const neighborNames = new Set();
    link.filter(l => l.source === d || l.target === d)
        .style("filter", "opacity(1)")
        .each(l => {
            neighborNames.add(l.source.name);
            neighborNames.add(l.target.name);
        });

    const neighborsArray = Array.from(neighborNames);

    nodeGroup.filter(n => neighborsArray.includes(n.name) || n.name === d.name)
        .style("filter", "opacity(1)");

    nodeGroup.selectAll("text").style("display", "none");
    nodeGroup.filter(n => n.name === d.name)
             .select("text")
             .style("display", "block");

    if (d.type === "Actor") {
        d3.select("#actorBlurb")
            .html("")
            .append("h1")
            .text(d.name)
            .attr("class", "item-name");
        
        d3.select("#actorBlurb").append("p")
            .html("<strong>TV Show(s):</strong> " + d.tvshows.join(", "));
    } else {
        const cast = d.cast === null ? "None" : d.cast;

        d3.select("#actorBlurb")
            .html("")
            .append("h1")
            .text(d.name)
            .attr("class", "item-name");
        
        d3.select("#actorBlurb").append("p")
            .html("<strong>Cast:</strong> " + cast);

        d3.select("#actorBlurb").append("p")
            .html("<strong>Genre:</strong> " + d.genre);
        
        d3.select("#actorBlurb").append("p")
            .html("<strong>Plot:</strong> " + d.description);
    }
}

function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeGroup
      .attr("transform", d => `translate(${d.x},${d.y})`);
  }