/*
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
import Delaunator from "delaunator";
*/

// tests for a map generator
exports.run = async (client, message) => {
  /*
  const canvas = await Canvas.createCanvas(1024, 1024);
  const ctx = canvas.getContext("2d");

  const GRIDSIZE = 25;
  const JITTER = 0.5;
  const points = [];

  for (let x = 0; x <= GRIDSIZE; x++) {
    for (let y = 0; y <= GRIDSIZE; y++) {
      points.push({
        x: x + JITTER * (Math.random() - Math.random()),
        y: y + JITTER * (Math.random() - Math.random()),
      });
    }
  }

  ctx.save();
  ctx.scale(canvas.width / GRIDSIZE, canvas.height / GRIDSIZE);
  ctx.fillStyle = "#C24243";
  for (const { x, y } of points) {
    ctx.beginPath();
    ctx.arc(x, y, 0.1, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();

  let delaunay = Delaunator.from(
    points,
    (loc) => loc.x,
    (loc) => loc.y
  );

  function calculateCentroids(points, delaunay) {
    const numTriangles = delaunay.halfedges.length / 3;
    const centroids = [];
    for (let t = 0; t < numTriangles; t++) {
      let sumOfX = 0,
        sumOfY = 0;
      for (let i = 0; i < 3; i++) {
        const s = 3 * t + i;
        const p = points[delaunay.triangles[s]];
        sumOfX += p.x;
        sumOfY += p.y;
      }
      centroids[t] = { x: sumOfX / 3, y: sumOfY / 3 };
    }
    return centroids;
  }

  const map = {
    points,
    numRegions: points.length,
    numTriangles: delaunay.halfedges.length / 3,
    numEdges: delaunay.halfedges.length,
    halfedges: delaunay.halfedges,
    triangles: delaunay.triangles,
    centers: calculateCentroids(points, delaunay),
  };

  function triangleOfEdge(e) {
    return Math.floor(e / 3);
  }
  function nextHalfedge(e) {
    return e % 3 === 2 ? e - 2 : e + 1;
  }

  function drawCellBoundaries(canvas, map) {
    let { points, centers, halfedges, triangles, numEdges } = map;
    let ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(canvas.width / GRIDSIZE, canvas.height / GRIDSIZE);
    ctx.lineWidth = 0.02;
    ctx.strokeStyle = "black";
    for (let e = 0; e < numEdges; e++) {
      if (e < delaunay.halfedges[e]) {
        const p = centers[triangleOfEdge(e)];
        const q = centers[triangleOfEdge(halfedges[e])];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  drawCellBoundaries(canvas, map);

  const attachment = new MessageAttachment(canvas.toBuffer(), "map.png");
  message.reply({
    files: [attachment],
  });
  */
};

exports.help = {
  name: "test",
  description: "test",
  aliases: [],
  usage: "test",
  category: "Owner",
};
