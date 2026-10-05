import React from "react";
import Navbar from "../Components/Navbar";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import CardItem from "../Components/CardItem";
import { message } from "antd";

function Dashboard() {
  const [allCards, setAllCards] = useState([]);
  const [recommendedCard, setRecommendedCard] = useState([]);
  const [likeCards, setLikeCards] = useState({});
  const [dislikeCards, setDislikeCards] = useState({});

  useEffect(() => {
    const fetchDashbordData = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const allCardsResponse = await axios.get(
          "http://localhost:8383/api/v1/card/get_All_Cards",
          config,
        );
        console.log("All Cards", allCardsResponse.data.data);
        setAllCards(allCardsResponse.data.data);

        const recommendedResponse = await axios.get(
          "http://localhost:8383/api/v1/card/get_RecommendedCards",
          config,
        );
        setRecommendedCard(recommendedResponse.data.data);
      } catch (error) {
        console.log("Dashbord api error", error);
      }
    };

    fetchDashbordData();
  }, []);

  async function handleLike(id) {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:8383/api/v1/card/like_card/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setLikeCards((prev) => ({
          ...prev,
          [id]: true,
        }));

        setDislikeCards((prev) => ({
          ...prev,
          [id]: false,
        }));

        setAllCards((prev) => {
          return prev.map((card) =>
            card._id === id ? { ...card, userAction: "like" } : card,
          );
        });

        setRecommendedCard((prev) =>
          prev.map((card) =>
            card._id === id ? { ...card, userAction: "like" } : card,
          ),
        );
      }

      message.success("Post liked..");
    } catch (error) {
      console.log("Like api error :", error);
    }
  }

  async function handleDislike(id) {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:8383/api/v1/card/dislike_card/${id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setDislikeCards((prev) => ({ ...prev, [id]: true }));
        setLikeCards((prev) => ({
          ...prev,
          [id]: false,
        }));

        setAllCards((prev) => {
          return prev.map((card) =>
            card._id == id ? { ...card, userAction: "dislike" } : card,
          );
        });

        setRecommendedCard((prev) =>
          prev.map((card) =>
            card._id === id ? { ...card, userAction: "dislike" } : card,
          ),
        );
      }
      message.success("Post dislike");
    } catch (error) {
      console.log("Dislike api error", error);
    }
  }
  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <div className="text-center mb-5">
          <h2>Dashboard</h2>
          <div className="mt-5">
            <h3 className="mb-4 fw-bold">All Cards</h3>

            <div className="row g-4">
              {allCards.map((card) => (
                <CardItem
                  key={card._id}
                  card={card}
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-4 fw-bold">Recomanded for you </h3>
            <div className="row g-4">
              {recommendedCard.map((card) => (
                <CardItem
                  key={card._id}
                  card={card}
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
