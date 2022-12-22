const { nanoid } = require("nanoid");
const bookshelf = require("./bookshelf");

const addBookHandler = (request, h) => {
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    readPage,
    pageCount,
    reading,
  } = request.payload;

  pageCount === readPage ? (finished = true) : (finished = false);

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const createBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  bookshelf.push(createBook);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
        bookName: name,
        bookPublisher: publisher,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let read, fin;

  if (reading) {
    reading == 0 ? (read = true) : (read = false);
  }
  if (finished) {
    finished == 0 ? (fin = false) : (fin = true);
  }

  const index = bookshelf.filter((b) => b.name == name)[0];
  const reads = bookshelf.filter((b) => b.reading === read)[0];
  const finish = bookshelf.filter((b) => b.finished === fin)[0];

  if (index) {
    const response = h.response({
      status: "success",
      data: {
        index,
      },
    });
    response.code(200);
    return response;
  }

  if (reads) {
    const response = h.response({
      status: "success",
      data: {
        reads,
      },
    });
    response.code(200);
    return response;
  }

  if (finish) {
    const response = h.response({
      status: "success",
      data: {
        finish,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      bookshelf,
    },
  });
  response.code(200);
  return response;
};

const getSpecificBookHandler = (request, h) => {
  const { id } = request.params;

  const book = bookshelf.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = bookshelf.findIndex((b) => b.id === id);

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { id } = request.params;
  const index = bookshelf.findIndex((b) => b.id === id);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  editBookHandler,
  deleteBookHandler,
  getSpecificBookHandler,
};
