// MongoDB diagnostic queries to check why user_preferences appears immutable

// 1. Check collection validation rules
db.runCommand({
    listCollections: 1,
    filter: { name: "user_preferences" }
})

// 2. Check indexes (unique constraints might prevent updates)
db.user_preferences.getIndexes()

// 3. Try a simple update to see the exact error
db.user_preferences.updateOne(
    { user_id: "test-user-123" },
    { $set: { theme: "light" } }
)

// 4. Check if there are any documents at all
db.user_preferences.find().pretty()

// 5. Try to drop validation (CAREFUL - this removes all validation)
// db.runCommand({
//     collMod: "user_preferences",
//     validator: {},
//     validationLevel: "off"
// })
