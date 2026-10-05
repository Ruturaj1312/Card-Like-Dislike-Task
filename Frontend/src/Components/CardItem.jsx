import React from "react";

function CardItem({ card, handleLike, handleDislike }) {
  const baseServerUrl = "http://localhost:8383";

  const image = card.image || card.img || "";
  const imgUrl = image.startsWith("/")
    ? `${baseServerUrl}${image}`
    : `${baseServerUrl}/uploads/${image}`;

  return (
    <>
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card h-100 shadow-sm border-0 rounded">
          <div className="position-relative">
            <img
              src={imgUrl}
              className="card-img-top"
              alt={card.title}
              style={{ height: "200px", objectFit: "cover" }}
            />
            <span className="badge bg-secondary position-absolute top-0 end-0 m-2">
              {card.category}
            </span>
          </div>

          <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-bold">{card.title}</h5>
            <p className="card-text text-muted">{card.description}</p>

            <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
              <button
                type="button"
                className={`btn btn-sm ${
                  card.userAction === "like"
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                onClick={() => handleLike(card._id)}
              >
                👍 {card.userAction === "like" ? "Liked" : "Like"}
              </button>

              <button
                type="button"
                className={`btn btn-sm ${
                  card.userAction === "dislike"
                    ? "btn-danger"
                    : "btn-outline-danger"
                }`}
                onClick={() => handleDislike(card._id)}
              >
                👎 {card.userAction === "dislike" ? "Disliked" : "Dislike"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardItem;
