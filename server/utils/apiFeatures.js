class APIFeatures {
    constructor(query , queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,//Allows the use of regular expressions when evaluating field values
                $options: 'i'//case insensitive
            }
        }//search keyword in database 
        : { }//do not search keyword

        this.query = this.query.find({ ...keyword });
        return this;
    }
    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage-1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }

    filter(){
        const queryCopy = { ...this.queryStr};

        // Removing field to query 
        const removeField = ['keyword', 'limit', 'page']
        removeField.forEach(el => delete queryCopy[el]);

        // Advance filter for price
        let queryString = JSON.stringify(queryCopy)

        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }
}

module.exports = APIFeatures ;