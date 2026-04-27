import { readFileSync, writeFileSync } from "node:fs";

const mapping = {
  "iosh-managing-safely": "/brand/courses/iosh-managing-safely.jpg",
  "iosh-working-safely": "/brand/courses/iosh-class.jpg",
  "nebosh-international-general-certificate": "/brand/courses/course-1.jpg",
  "othm-level-6-diploma-ohs": "/brand/courses/course-2.jpg",
  "habc-level-2-food-safety": "/brand/courses/course-3.jpg",
  "fire-marshal-warden": "/brand/courses/fire-warden.jpg",
  "iema-foundation-sustainability": "/brand/courses/course-4.jpg",
  "first-aid-at-work": "/brand/courses/course-5.jpg",
};

const path = new URL("../content/data/courses.json", import.meta.url);
const data = JSON.parse(readFileSync(path, "utf-8"));
for (const course of data) {
  if (mapping[course.slug]) {
    course.heroImage = mapping[course.slug];
  }
}
writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`assigned hero images to ${data.filter((c) => c.heroImage).length} of ${data.length} courses`);
