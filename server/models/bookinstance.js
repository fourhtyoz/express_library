import { DateTime } from 'luxon';
import { Schema, model } from 'mongoose';

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  due_back: { type: Date, default: Date.now },
});

BookInstanceSchema.virtual('url').get(function () {
  return `/catalog/bookinstance/${this._id}`;
});

BookInstanceSchema.virtual('due_back_formatted').get(function() {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED)
})

BookInstanceSchema.virtual('due_back_yyyy_mm_dd').get(function () {
    return DateTime.fromJSDate(this.due_back).toISODate(); // format 'YYYY-MM-DD'
  });
  

export default model('BookInstance', BookInstanceSchema);
