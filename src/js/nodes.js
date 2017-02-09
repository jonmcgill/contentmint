//
//  src/js/nodes.js
//
g['$'] = {
    app: $(g.id.app),
    stage: $(g.id.stage),
    thumbnails: $(g.id.thumbnails),
    trash: $(g.id.trash)
}

g.node = {
    app: g.$.app[0],
    stage: g.$.stage[0],
    thumbnails: g.$.thumbnails[0],
    trash: g.$.trash[0]
}