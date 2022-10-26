
figma.showUI(__html__, {
  height: 140
});


function getStyle(styleName: string): PaintStyle {
  return figma.getLocalPaintStyles().find((style) => style.name === styleName);
}

function replaceStyles(node: SceneNode, oldStyleName: string, newStyleName: string) {
  const style = figma.getStyleById(node.fillStyleId);
  if(style !== null) {
    const newStyle = getStyle(style.name.replace(oldStyleName, newStyleName));
    node.fillStyleId = newStyle.id;
  }

  // Recursive children
  if(!node.children) {
    return;
  }
  node.children.forEach((child) => {
    replaceStyles(child, oldStyleName, newStyleName);
  })
}

figma.ui.onmessage = msg => {
  if (msg.type === 'replace-styles') {
    figma.currentPage.selection.forEach((el) => {
      replaceStyles(el, msg.old, msg.new);
    });
  }

  figma.closePlugin();
};
