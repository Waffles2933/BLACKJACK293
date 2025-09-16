import React from "react";
import { Link } from "react-router-dom";

export default function GameHub() {
  return (
    <div style={styles.container}>
      <h1>Ultimate Casino Game Hub</h1>
      <div style={styles.buttons}>
        <Link to="/blackjack"><button>Blackjack</button></Link>
        <Link to="/poker"><button>Poker</button></Link>
        <Link to="/roulette"><button>Roulette</button></Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    background: "#0b1220",
    color: "#e6eef8",
    minHeight: "100vh",
  },
  buttons: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
  },
};
