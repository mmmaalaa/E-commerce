import apiError from "../utils/apiError.js";
import APIFeatures from "../utils/apiFeatures.js";

export const deleteOne = (Model) => async (req, res, next) => {
  const document = await Model.findByIdAndDelete(req.params.id);
  if (!document) {
    return next(new apiError(`document with ID not found`, 404));
  }
  return res.status(204).json({
    status: "success",
    data: null,
  });
};

export const updateOne = (Model) => async (req, res, next) => {
  const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!document) {
    return next(new apiError(`document with ID not found`, 404));
  }
  document.save();
  return res.status(200).json({
    status: "success",
    data: {
      document,
    },
  });
};

export const getOne = (Model, options) => async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (options) {
    query = query.populate(options);
  }
  const document = await query;
  if (!document) {
    return next(new apiError(`No document found with that ID`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      document,
    },
  });
};

export const createOne =
  (Model, options = {}) =>
  async (req, res, next) => {
    const references = options.references || [];

    for (const ref of references) {
      if (req.body[ref.field]) {
        const exists = await ref.model.findById(req.body[ref.field]);
        if (!exists) {
          return next(new apiError(`${ref.name} with ID not found`, 404));
        }
      }
    }
    const document = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        document,
      },
    });
  };

export const getAll = (Model, modelName) => async (req, res) => {
  const filter = {};
  if (req.params.categoryId) {
    filter.category = req.params.categoryId;
  }
  const countDocuments = await Model.countDocuments();
  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .fieldLimiting()
    .search(modelName)
    .paginate(countDocuments);

  const document = await features.query;
  return res.status(200).json({
    status: "success",
    results: document.length,
    paginationResult: features.paginationResult,
    data: {
      document,
    },
  });
};
