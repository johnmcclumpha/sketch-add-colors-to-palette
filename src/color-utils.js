export function setSwatches(sketch, attribute = 'fill', name = 'color') {
  // attribute is 'fill' or 'border'
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
      } else if(attribute === 'border') {
        layer.style.borders.forEach(function (border, j) {
          if(border.fillType === 'Color'){
            swatchcolors.push({'color':border.color, 'name':layer.name})
          }
        })
      }
    })

    if(swatchcolors.length > 0) {
      var totalAdded = 0
      var totalSkipped =0
      swatchcolors.forEach(function(fillcolor, i) {
        var swatchName = name === 'layer' ? fillcolor.name : fillcolor.color
        var mscolor = MSImmutableColor.colorWithSVGString(fillcolor.color).newMutableCounterpart()
        var newcolor = MSColorAsset.alloc().initWithAsset_name(mscolor, swatchName)
        var foundSwatch = false
        document.colors.forEach(function(docSwatch) {
          if(docSwatch.type === 'ColorAsset' && docSwatch.name === swatchName) {
            foundSwatch = true
          }
        })
        if(foundSwatch === false) {
          totalAdded++
          colorAssets.push(newcolor)          
        } else {
          totalSkipped++
        }
      })
      var doc = context.document
      var assets = doc.documentData().assets()

      assets.addColorAssets(colorAssets)
      sketch.UI.message(`${totalAdded} colors added, ${totalSkipped} skipped`)
    } else {
      sketch.UI.message(`No ${attribute} colors found`)
    }
  }
  
}
