import sketch from 'sketch'

export default function(context) {

  const document = sketch.getSelectedDocument()
  const selectedLayers = document.selectedLayers
  const selectedCount = selectedLayers.length

  var fillcolors = []
  var colorAssets = []

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected.')
  } else {
    selectedLayers.forEach(function (layer, i) {
      layer.style.fills.forEach(function (fill, j) {
        if(fill.fill === 'Color'){
          fillcolors.push(fill.color)
        }
      })
    })

    if(fillcolors.length > 0) {
      fillcolors.forEach(function(fillcolor, i) {
        var mscolor = MSImmutableColor.colorWithSVGString(fillcolor).newMutableCounterpart()
        var newcolor = MSColorAsset.alloc().initWithAsset_name(mscolor, fillcolor)
        colorAssets.push(newcolor)
      })
      var doc = context.document
      var assets = doc.documentData().assets()
      assets.addColorAssets(colorAssets)
      sketch.UI.message(`${fillcolors.length} colors added.`)
    } else {
      sketch.UI.message('No fill colors found')
    }
  }
  
}
