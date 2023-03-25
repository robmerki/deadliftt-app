import { Node, Position, Edge } from 'reactflow'
import dagre from 'dagre'

export type RawBullets = {
  [key: string]: {
    [key: string]: {
      [key: string]: string[]
    }
  }
}

const nodeWidth = 172
const nodeHeight = 36

function processNodesIntoDagreTree(nodes: Node[], edges: Edge[]) {
  const isHorizontal = false

  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  dagreGraph.setGraph({
    rankdir: 'TB',
    ranker: 'network-simplex',
    nodesep: 10,
    marginx: 10,
    marginy: 10,
    ranksep: 100,
  })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
    edge.type = 'smoothstep'
  })

  dagre.layout(dagreGraph)

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = isHorizontal ? Position.Left : Position.Top
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    }

    return node
  })

  return { nodes, edges }
}

export function dataToNodes(data: RawBullets) {
  const nodes: Node[] = []
  const edges: Edge[] = []

  Object.keys(data).forEach((topic) => {
    const topicNodeId = `${topic}_node`
    nodes.push({
      id: topicNodeId,
      type: 'input',
      data: { label: topic },
      position: { x: 0, y: 0 },
    })

    Object.keys(data[topic]).forEach((category) => {
      const categoryNodeId = `${topic}_${category}_node`
      const categoryEdgeId = `${topic}_${category}_edge`
      nodes.push({
        id: categoryNodeId,
        type: 'default',
        data: { label: category },
        position: { x: 0, y: 0 },
      })

      edges.push({
        id: categoryEdgeId,
        source: topicNodeId,
        target: categoryNodeId,
      })

      Object.keys(data[topic][category]).forEach((subCategory) => {
        const subCategoryNodeId = `${category}_${subCategory}_node`
        const subCategoryEdgeId = `${category}_${subCategory}_edge`
        nodes.push({
          id: subCategoryNodeId,
          type: 'default',
          data: { label: subCategory },
          position: { x: 0, y: 0 },
        })

        edges.push({
          id: subCategoryEdgeId,
          source: categoryNodeId,
          target: subCategoryNodeId,
        })

        data[topic][category][subCategory].forEach((bullet) => {
          const bulletNodeId = `${category}_${subCategory}_${bullet}_node`
          const bulletEdgeId = `${category}_${subCategory}_${bullet}_edge`
          nodes.push({
            id: bulletNodeId,
            type: 'default',
            data: { label: bullet },
            position: { x: 0, y: 0 },
          })

          edges.push({
            id: bulletEdgeId,
            source: subCategoryNodeId,
            target: bulletNodeId,
          })
        })
      })
    })
  })
  return processNodesIntoDagreTree(nodes, edges)
}
