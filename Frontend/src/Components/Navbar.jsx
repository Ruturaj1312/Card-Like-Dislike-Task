import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  function handleClick() {
    localStorage.clear("token");
    navigate("/login");
  }
  return (
    <>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            Home
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a
                  class="nav-link active"
                  aria-current="page"
                  href="/create-card"
                >
                  Create Card
                </a>
              </li>
            </ul>
            <form class="d-flex" role="search">
              <button
                class="btn btn-outline-danger"
                onClick={() => handleClick()}
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
