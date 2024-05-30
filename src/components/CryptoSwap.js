import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoDropdown from "../components/CryptoDropdown";

const CryptoSwap = () => {
  const [cryptos, setCryptos] = useState([]);
  const [fromCrypto, setFromCrypto] = useState(null);
  const [toCrypto, setToCrypto] = useState(null);
  const [amount, setAmount] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/list"
      );
      console.log(response);
      const options = response.data.map((coin) => ({
        value: coin.id,
        label: coin.name,
      }));
      setCryptos(options);
    } catch (error) {
      console.error("Error fetching cryptocurrencies", error);
    }
  };

  const handleSwap = async () => {
    if (!fromCrypto || !toCrypto || !amount) {
      setMessage("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price`,
        {
          params: {
            ids: `${fromCrypto.value},${toCrypto.value}`,
            vs_currencies: "usd",
          },
        }
      );
      console.log(fromCrypto);
      console.log(response.data);

      const fromRate = response.data[fromCrypto.value].usd;
      const toRate = response.data[toCrypto.value].usd;
      const estimatedAmount = (amount * fromRate) / toRate;

      setEstimate(estimatedAmount.toFixed(6));
      setMessage("Swap successful!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage("Error during the swap.");
    }
  };

  return (
    <div className="crypto-swap">
      <h1>Crypto Swap</h1>
      <CryptoDropdown
        options={cryptos}
        onChange={setFromCrypto}
        value={fromCrypto}
      />

      <CryptoDropdown
        options={cryptos}
        onChange={setToCrypto}
        value={toCrypto}
      />

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        min="0"
        onChange={(e) => {
          console.log(e);
          setAmount(e.target.value);
        }}
      />

      <button onClick={handleSwap} disabled={loading}>
        {loading ? "Swapping..." : "Get Crypto"}
      </button>
      {estimate && (
        <p className="messagesuccess">
          {estimate} {toCrypto.label}
        </p>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CryptoSwap;
