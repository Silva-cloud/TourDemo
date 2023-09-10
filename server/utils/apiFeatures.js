// const Tour = require('../models/tourModel');
class ApiFeatures {
  constructor(query, queryString) {
    //Building the Query
    this.query = query;
    this.queryString = queryString;
  }

  filter = () => {
    const filterQueriesOnly = { ...this.queryString };
    const nonFilterQueries = ['page', 'sort', 'fields', 'limit'];
    nonFilterQueries.forEach((item) => delete filterQueriesOnly[item]);
    // console.log('this.filterQueriesOnly1 ', filterQueriesOnly);
    // console.log('this.filterQueriesOnly ', filterQueriesOnly);
    const queryStr = JSON.stringify(filterQueriesOnly).replace(
      /\b(gt|lt|lte|gte)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  };

  sort = () => {
    //sorting
    // console.log(this.query);
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log('sortBy ', sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt name');
    }
    return this;
  };

  project = () => {
    // projection
    if (this.queryString.fields) {
      const projects = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(projects);
      // this.query = this.query.select(` ${projects} -_id`);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  };

  //pagination
  paginate = (toursNum) => {
    const pageNum = this.queryString.page || 1;
    const limit = this.queryString.limit || 100;
    const skip = (pageNum - 1) * limit;
    if (this.queryString.page) {
      // console.log('pageNum: ', pageNum - 1);
      // const toursNum = await Tour.countDocuments();
      // console.log('skip: ', skip, 'toursNum ', toursNum);
      if (skip >= toursNum) {
        // console.log('skip: ', skip, 'toursNum ', toursNum);
        throw new Error("this page doesn't exists");
      }
    }
    this.query = this.query.skip(skip).limit(limit);
    // console.log('pageNum: ', pageNum);
    // console.log('skip: ', skip);

    return this;
  };
}
module.exports = ApiFeatures;
