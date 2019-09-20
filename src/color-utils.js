export function setSwatches(sketch, attribute = 'fill', name = 'color') {
  // attribute is 'fill' or 'stroke'
  // name is 'color' or 'layer'

  const document = sketch.getSelectedDocument()
  const selectedLayers = document.selectedLayers
  const selectedCount = selectedLayers.length

  var swatchcolors = []
  var colorAssets = []

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected.')
  } else {
    selectedLayers.forEach(function (layer, i) {
      if(attribute === 'fill') {
        layer.style.fills.forEach(function (fill, j) {
          if(fill.fill === 'Color'){
            swatchcolors.push({'color':fill.color, 'name':layer.name})
          }
        })
      } else if(attribute === 'stroke') {
        layer.style.borders.forEach(function (border, j) {
          if(border.fillType === 'Color'){
            swatchcolors.push({'color':border.color, 'name':layer.name})
          }
        })
      }
    })

    if(swatchcolors.length > 0) {
      swatchcolors.forEach(function(fillcolor, i) {
        var swatchName = name === 'layer' ? fillcolor.name : fillcolor.color
        var mscolor = MSImmutableColor.colorWithSVGString(fillcolor.color).newMutableCounterpart()
        var newcolor = MSColorAsset.alloc().initWithAsset_name(mscolor, swatchName)
        // @todo check if the current swatchName exists, if so - don't add it (or update it)?
        colorAssets.push(newcolor)
      })
      var doc = context.document
      var assets = doc.documentData().assets()
      assets.addColorAssets(colorAssets)
      sketch.UI.message(`${swatchcolors.length} colors added 😀`)
    } else {
      sketch.UI.message('No fill colors found')
    }
  }
  
}
