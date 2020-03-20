function pageSize(req, defaultPage = 1, defaultSize = 10) {
  var { page, size } = req.query;
  page = parseInt(page, 10);
  size = parseInt(size, 10);
  if (isNaN(page)) page = defaultPage;
  if (isNaN(size)) size = defaultSize;
  return [ page, size ];
}


module.exports = {
  pageSize
};

