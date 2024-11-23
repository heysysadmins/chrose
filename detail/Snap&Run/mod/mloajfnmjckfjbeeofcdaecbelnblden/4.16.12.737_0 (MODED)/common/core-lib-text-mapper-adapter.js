(function () {
    window.dji = window.dji || {};
    window.dji.mapping = window.dji.mapping || {};
    window.dji.gdocsCanvasProjectionTagName = "dji-canvas-v1";
    window.dji.DocumentTextMapperAdapter =
        window.__DjiTextMapper.DocumentTextMapperAdapter;
    window.dji.mapping.DocumentTextMapper =
        window.__DjiTextMapper.DocumentTextMapper;
    window.dji.mapping.DocumentTextMapperUtils =
        window.__DjiTextMapper.DocumentTextMapperUtils;
    window.dji.selectionMapper =
        window.__DjiTextMapper.SelectionMapper.getInstance();
    window.__DjiTextMapper.SelectionHandler.impl = window.dji.selectionMapper;
    window.dji.ParaLineGuide = window.__DjiTextMapper.ParaLineGuide;
})();
