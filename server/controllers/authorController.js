import Author, { find, findById, findByIdAndDelete, findByIdAndUpdate } from '../models/author';
import { find as _find } from '../models/book';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

export const author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await find().sort({ family_name: 1 }).exec();
    res.render('author_list', {
      title: 'Author List',
      author_list: allAuthors,
    });
});

export const author_detail = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
      findById(req.params.id).exec(),
      _find({ author: req.params.id }, 'title summary').exec(),
    ]);
  
    if (author === null) {
      // No results.
      const err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }
  
    res.render('author_detail', {
      title: 'Author Detail',
      author: author,
      author_books: allBooksByAuthor,
    });
  });
  

export const author_create_get = asyncHandler(async (req, res, next) => {
    res.render('author_form', { title: 'Create Author' });
});

export const author_create_post = [
    // Validate and sanitize fields.
    body('first_name')
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage('First name must be specified.')
      .isAlphanumeric()
      .withMessage('First name has non-alphanumeric characters.'),
    body('family_name')
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage('Family name must be specified.')
      .isAlphanumeric()
      .withMessage('Family name has non-alphanumeric characters.'),
      
    // TODO: fix these
    body('date_of_birth', 'Invalid date of birth'),
      // .optional({ values: 'falsy' })
      // .isISO8601()
      // .toDate(),
    body('date_of_death', 'Invalid date of death'),
      // .optional({ values: 'falsy' })
      // .isISO8601()
      // .toDate(),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create Author object with escaped and trimmed data
      const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('author_form', {
          title: 'Create Author',
          author: author,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
  
        // Save author.
        await author.save();
        // Redirect to new author record.
        res.redirect(author.url);
      }
    }),
  ];
  

export const author_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
      findById(req.params.id).exec(),
      _find({ author: req.params.id }, 'title summary').exec(),
    ]);
  
    if (author === null) {
      // No results.
      res.redirect('/catalog/authors');
    }
  
    res.render('author_delete', {
      title: 'Delete Author',
      author: author,
      author_books: allBooksByAuthor,
    });
  });
  

export const author_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
      findById(req.params.id).exec(),
      _find({ author: req.params.id }, 'title summary').exec(),
    ]);
  
    if (allBooksByAuthor.length > 0) {
      // Author has books. Render in same way as for GET route.
      res.render('author_delete', {
        title: 'Delete Author',
        author: author,
        author_books: allBooksByAuthor,
      });
      return;
    } else {
      // Author has no books. Delete object and redirect to the list of authors.
      await findByIdAndDelete(req.body.authorid);
      res.redirect('/catalog/authors');
    }
  });
  

export const author_update_get = asyncHandler(async (req, res, next) => {
  const author = await findById(req.params.id).exec()
  if (author) {
    res.render('author_form', {author: author})
  }
  else {
    res.redirect('/catalog/authors');
  }
});

export const author_update_post = [
  body('first_name')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('family_name')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('date_of_birth')
    .trim()
    .escape(),
  body('date_of_death')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id
    })

    console.log(req.params)
    console.log(author.first_name)

    if (!errors.isEmpty) {
      console.log(errors)
      res.render('author_form', {title: 'Updated author', author: author, errors: errors})
      return;
    } else {
      const updatedAuthor = await findByIdAndUpdate(req.params.id, author, {});
      console.log(updatedAuthor)
      res.redirect(updatedAuthor.url);
      return;
    }
  })
]
