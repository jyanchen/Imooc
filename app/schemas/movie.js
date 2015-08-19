var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
    doctor: String, // 导演
    title: String, // 电影名
    languaue: String, // 语种
    summary: String, // 简介
    flash: String, // 电影短片或相关视频
    poster: String, // 海报
    year: String, // 年份
    country: String, // 制片国家/地区
    DouBanId: String, // 豆瓣的电影ID
    watched: { // 是否已观看 0:想看 1:看过
        type: Number,
        default: 0
    },
    rating: { // 评分
        type: Number,
        default: 0
    },
    pv: { // 浏览数
        type: Number,
        default: 0
    },
    category: { // 分类
        type: ObjectId,
        ref: "Category"
    },
    meta: { // 时间戳
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

MovieSchema.pre("save", function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
});

MovieSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort({
                "meta.updateAt": -1
            })
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb)
    }
    // ,
    // group: function(cb) {
    //     return this
	   //          .group({
	   //              $keyf: function(keyf) {
	   //                  return {
	   //                      watched: keyf.watched
	   //                  }
	   //              },
	   //              initial: {
	   //                  movies: []
	   //              },
	   //              $reduce: function(item, init) {
	   //                  init.movies.push(item);
	   //              }
	   //          })
	   //          .exec(cb)
    // }
}

module.exports = MovieSchema;
