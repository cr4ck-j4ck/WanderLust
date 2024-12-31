router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const note = await Note.findByIdAndUpdate(id, { content: req.body.editedContent });
    res.redirect("/notes");
})