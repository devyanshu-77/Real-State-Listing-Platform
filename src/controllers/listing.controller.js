async function createListing(req, res) {
  const {
    title,
    description,
    price,
    location,
    propertyType,
    bedrooms,
    bathrooms,
    area,
  } = req.body;

  console.log(req.files);
  res.send("OK");
}

export { createListing };
