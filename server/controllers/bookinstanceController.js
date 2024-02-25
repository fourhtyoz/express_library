import BookInstance, { find, findById } from '../models/bookinstance';
import { find as _find } from '../models/book';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

export const bookinstance_list = asyncHandler(async (req, res, next) => {
    const allBookInstance = await find().populate('book').exec()
    res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: allBookInstance,
    })
});

export const bookinstance_detail = asyncHandler(async (req, res, next) => {
    const bookInstance = await findById(req.params.id)
      .populate('book')
      .exec();
  
    if (bookInstance === null) {
      // No results.
      const err = new Error('Book copy not found');
      err.status = 404;
      return next(err);
    }
  
    res.render('bookinstance_detail', {
      title: 'Book:',
      bookinstance: bookInstance,
    });
  });
  

export const bookinstance_create_get = asyncHandler(async (req, res, next) => {
    const allBooks = await _find({}, 'title').sort({ title: 1 }).exec();
  
    res.render('bookinstance_form', {
      title: 'Create BookInstance',
      book_list: allBooks,
    });
  });
  

export const bookinstance_create_post = [
    // Validate and sanitize fields.
    body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint must be specified')
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body('status').escape(),
    body('due_back', 'Invalid date')
      .optional({ values: 'falsy' })
      .isISO8601()
      .toDate(),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a BookInstance object with escaped and trimmed data.
      const bookInstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back,
      });
  
      if (!errors.isEmpty()) {
        // There are errors.
        // Render form again with sanitized values and error messages.
        const allBooks = await _find({}, 'title').sort({ title: 1 }).exec();
  
        res.render('bookinstance_form', {
          title: 'Create BookInstance',
          book_list: allBooks,
          selected_book: bookInstance.book._id,
          errors: errors.array(),
          bookinstance: bookInstance,
        });
        return;
      } else {
        // Data from form is valid
        await bookInstance.save();
        res.redirect(bookInstance.url);
      }
    }),
  ];
  

export const bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
});

export const bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
});

export const bookinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
});

export const bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
});
