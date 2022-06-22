const { db, firebaseSecondaryApp } = require("../../config/admin");
const { validateBookData } = require('./bookHelper');

exports.newBook = async (req, res) => {
    const data = req.body
    const { valid, errors } = validateBookData(data);
    try {
        if (!valid) {
            return res.status(400).json({
                errors,
            });
        } else {
            console.log("call else")

            const bookData = {
                book_name: data.name,
                book_auther: data.auther,
                book_available: true,
                published_date: data.publishedDate,
                book_discription: data.discription,
                book_rating: data.rating,
                cover_page: data.coverPage,
                language: data.language,
                awards: data.awards,
                // characters:data,
                category: data.category,
                created_at: new Date(),
                is_deleted: false
            }
            await db.collection("books").doc().set(bookData);
            return res.status(200).json({
                message: "Book is created...!!",
            });
        }
    } catch (error) {
        return res.status(400).json({ errors: "something want to worng" });
    }
}

exports.listBooks = async (req, res) => {
    try {
        const books = [];
        const data = await db.collection("books").orderBy('created_at', 'desc').get();
        data.forEach((doc) => {
            if (doc.data().is_deleted === false && doc.data().book_available === true) {
                const book = { id: doc.id, bookData: doc.data() };
                books.push(book);
            }
        });
        return res.status(200).json({ books: books })

    } catch (error) {
        return res.status(400).json({ error: "Something want to wrong..." })
    }
}

exports.bookDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.book_id;
        const data = await db.collection("books").doc(id).get();
        if (data.data() === undefined) {
            errors.push({ msg: "Book data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        const bookData = data.data();
        return res.status(200).json({ bookData: bookData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}

exports.updateBookDetails = async (req, res) => {
    try {
        const id = req.params.book_id;
        const data = req.body;
        const { valid, errors } = validateBookData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        const bookData = {
            book_name: data.name,
            book_auther: data.auther,
            published_date: data.publishedDate,
            book_discription: data.discription,
            book_rating: data.rating,
            cover_page: data.coverPage,
            language: data.language,
            awards: data.awards,
            // characters:data,
            category: data.category,
        }
        const updateBook = await db.collection("books").doc(id);
        await updateBook.update(bookData);
        const ub = await updateBook.get();
        const updateData = ub.data();
        return res.status(200).json({ bookData: updateData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }

}

exports.bookRemove = async (req, res) => {
    try {
        const id = req.params.book_id;
        const data = await db.collection("books").doc(id);
        await data.update({ is_deleted: true });
        return res.status(200).json("Book deleted...");
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}