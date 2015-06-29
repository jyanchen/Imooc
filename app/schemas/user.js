var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 0;

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	// 0:normal user
	// 1:verifed user
	// 2:profession user
	// >10:admin
	// >50:supper admin
	role: {
		type: Number,
		default: 0
	},
	meta: {
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

UserSchema.pre("save", function(next) {
	var user = this;

	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	/*
	 * 加密
	 * SALT_WORK_FACTOR: 加密强度
	 */
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			console.log("user.js: " + user)
			next();
		})
	})
});

UserSchema.methods = {
	comparePassword: function(_password, cb) {
		bcrypt.compare(_password, this.password, function(err, isMatch) {
			if (err) {
				return cb(err);
			}

			cb(null, isMatch);
		})
	}
};

UserSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort("meta.updateAt")
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({
				_id: id
			})
			.exec(cb)
	}
};


module.exports = UserSchema;