import Genre, { find, findById, findOne } from '../models/genre';
import { find as _find } from '../models/book';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';


export const genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await find().sort({name: 1}).exec()
    res.render('genre_list', {title: 'Genre List', genre_list: allGenres})
});

export const genre_detail = asyncHandler(async (req, res, next) => {
    const [genre, booksInGenre] = await Promise.all([
        findById(req.params.id).exec(),
        _find({genre: req.params.id}, 'title summary').exec()
    ])
    if (genre === null) {
        const err = new Error('genre not found')
        err.status = 404
        return next(err)
    } else {
        res.render('genre_detail', {
            title: 'Genre Detail',
            genre: genre,
            genre_books: booksInGenre
        })
    }
});

export const genre_create_get = asyncHandler(async (req, res, next) => {
  res.render('genre_form',  { title: 'Create Genre' });
});

export const genre_create_post = [
    // Validate and sanitize the name field.
    body('name', 'Genre name must contain at least 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape(),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      const genre = new Genre({ name: req.body.name });
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('genre_form', {
          title: 'Create Genre',
          genre: genre,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        const genreExists = await findOne({ name: req.body.name }).exec();
        if (genreExists) {
          // Genre exists, redirect to its detail page.
          res.redirect(genreExists.url);
        } else {
          await genre.save();
          // New genre saved. Redirect to genre detail page.
          res.redirect(genre.url);
        }
      }
    }),
  ];

export const genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre delete GET');
});

export const genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre delete POST');
});

export const genre_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre update GET');
});

export const genre_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre update POST');
});
