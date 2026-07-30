const url =
  "https://res.cloudinary.com/mycloud/image/upload/123456/dbname/user-12345/photos-1785398655567-changed.jpg";

// To get just the ID:
const idMatch = url.match(/\/user-([^/]+)\//);
console.log(idMatch);
if (idMatch) {
  console.log(idMatch[1]); // Output: 12345
}

// To get the full user-<id> part:
const userMatch = url.match(/\/user-[^/]+/);
if (userMatch) {
  console.log(userMatch[0].replace("/", "")); // Output: user-12345
}
