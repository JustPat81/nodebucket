/**
 * Title: item.js
 * Author: Prof. Krasso
 * Date: 15 January 2023
 * Modified By: Patrick Wolff
 * Description: item.js file
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let itemSchema = new Schema({
  text: { type: String }
})

module.exports = itemSchema;
