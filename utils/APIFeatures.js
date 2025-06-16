export default class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryStrObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryStrObj[el]);

    const formattedQuery = {};
    Object.keys(queryStrObj).forEach((key) => {
      const [field, operator] = key.split(".");
      const validOperators = ["gte", "gt", "lte", "lt"];
      if (field && operator && validOperators.includes(operator)) {
        if (!formattedQuery[field]) formattedQuery[field] = {};
        formattedQuery[field][`$${operator}`] = Number(queryStrObj[key]);
      }
    });

    this.query = this.query.find(formattedQuery); // إضافة الـ query
    return this;
  }

  search(model) {
    if (this.queryString.search) {
      const searchTerm = this.queryString.search;
      let searchQuery = {};
      if (model === "Product") {
        searchQuery = {
          $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
          ],
        };
      } else {
        searchQuery = { name: { $regex: searchTerm, $options: "i" } };
      }
      this.query = this.query.find(searchQuery);
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  fieldLimiting() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate(countDocuments) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;
    const numberOfPages = Math.ceil(countDocuments / limit);
    const endIndex = page * limit;

    const pagination = {};
    pagination.CurrentPage = page;
    pagination.Limit = limit;
    pagination.NumberOfPages = numberOfPages;
    if (endIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    if (skip > 0) {
      pagination.previousPage = page - 1;
    }

    this.paginationResult = pagination;
    this.query = this.query.skip(skip).limit(limit); // تصحيح الـ skip وlimit
    return this;
  }
}
