

export const getOneById = model => async (req, res) => {
  try {
    const doc = await model
      .findById( req.params.id )
      .lean()
      .exec();

    if (!doc) {
      return res.status(404).end();
    }
    res.status(200).json({ data: doc });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export const getOneByUserId = model => async (req, res) => {
  try {
    const doc = await model
      .findOne({ user: req.user._id })
      .lean()
      .exec();

    if (!doc) {
      return res.status(404).end();
    }
    res.status(200).json({ data: doc });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export const getManyByUserId = model => async (req, res) => {
  try {
    const docs = await model
      .find({ user: req.user._id })
      .lean()
      .exec();

    res.status(200).json({ data: docs });
  } catch (error) {
    console.error(error);
  }
};

export const getMany = model => async (req, res) => {
  try {
    const docs = await model
      .find({})
      .lean()
      .exec();

    res.status(200).json({ data: docs });
  } catch (error) {
    console.error(error);
  }
};

export const createOne = model => async (req, res) => {
  try {
    const doc = await model.create(req.body);
    res.status(201).json({ data: doc });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export const updateOne = model => async (req, res) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          _id: req.params.id
        },
        req.body,
        { new: true }
      )
      .lean()
      .exec();

    if (!updatedDoc) {
      return res.status(400).end();
    }

    res.status(200).json({ data: updatedDoc });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export const removeOne = model => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      _id: req.params.id
    });

    if (!removed) {
      return res.status(400).end();
    }
    return res.status(200).json({ data: removed });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

export const crudControllers = (model) => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getManyByUserId: getManyByUserId(model),
  getOneById: getOneById(model),
  getOneByUserId: getOneByUserId(model),
  createOne: createOne(model)
});
