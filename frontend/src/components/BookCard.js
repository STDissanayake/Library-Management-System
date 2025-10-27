// In BooksList.js - fix the author click handler to search authors by name
const handleAuthorClick = async (authorID, authorName) => {
  try {
    console.log("🟡 Clicked author - Name:", authorName, "ID:", authorID)

    let authorData = {
      authorName: authorName,
      authorID: authorID,
      bio: "Searching for author details..."
    }

    // Show loading state immediately
    setHoveredAuthor(authorData)

    // If we have authorID, fetch by ID
    if (authorID && authorID !== "N/A" && authorID !== "null") {
      try {
        console.log("🟡 Fetching author by ID:", authorID)
        const response = await AuthorService.getAuthorById(authorID)
        console.log("🟢 Author details by ID:", response.data)

        authorData = {
          ...authorData,
          ...response.data,
          bio: response.data.bio || "Biography not available",
          authorName: response.data.authorName || response.data.name || authorName
        }
      } catch (apiErr) {
        console.error("🔴 Error fetching by ID:", apiErr)
        // If ID fails, try searching by name
        await searchAuthorByName(authorName, authorData)
      }
    } else {
      // No authorID, search by name
      await searchAuthorByName(authorName, authorData)
    }

  } catch (err) {
    console.error("🔴 Error in author click handler:", err)
    setHoveredAuthor({
      authorName: authorName,
      authorID: authorID,
      bio: "Error loading author details"
    })
  }
}

// Helper function to search author by name
const searchAuthorByName = async (authorName, currentAuthorData) => {
  try {
    console.log("🟡 Searching author by name:", authorName)

    // Get all authors and find by name
    const response = await AuthorService.getAllAuthors()
    const allAuthors = response.data || response || []

    console.log("📚 All authors from API:", allAuthors)

    // Find author by name (case insensitive, partial match)
    const foundAuthor = allAuthors.find(author => {
      const authorNameMatch = author.authorName || author.name
      return authorNameMatch && authorNameMatch.toLowerCase().includes(authorName.toLowerCase())
    })

    if (foundAuthor) {
      console.log("🎯 Found author:", foundAuthor)
      setHoveredAuthor({
        authorName: foundAuthor.authorName || foundAuthor.name || authorName,
        authorID: foundAuthor.authorID || foundAuthor.id,
        bio: foundAuthor.bio || "Biography not available",
        nationality: foundAuthor.nationality,
        birthYear: foundAuthor.birthYear
      })
    } else {
      console.log("🔴 Author not found in database")
      setHoveredAuthor({
        ...currentAuthorData,
        bio: "Author not found in database"
      })
    }

  } catch (searchErr) {
    console.error("🔴 Error searching author by name:", searchErr)
    setHoveredAuthor({
      ...currentAuthorData,
      bio: "Unable to search author database"
    })
  }
}