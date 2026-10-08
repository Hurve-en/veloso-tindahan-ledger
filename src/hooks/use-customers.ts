import { useEffect, useState } from "react";
import { Customer, fetchCustomers } from "@/data/customer";
import { problemFor, Status } from "@/data/problem";

export function useCustomers() {
  const [status, setStatus] = useState<Status>("loading");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [problem, setProblem] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    fetchCustomers()
      .then((data) => {
        setCustomers(data);
        setStatus(data.length === 0 ? "empty" : "content");
      })
      .catch((err) => {
        console.log("API ERROR:", err);
        setProblem(problemFor(err));
        setStatus("error");
      });
  }, [attempt]);

  return {
    status,
    customers,
    problem,
    // Changing the attempt value reloads the list without remounting the screen.
    retry: () => {
      setStatus("loading");
      setAttempt((value) => value + 1);
    },
  };
}

/* to show loading


  useEffect(() => {
  setStatus("loading");

  setTimeout(() => {
    fetchCustomers()
      .then((data) => {
        setCustomers(data);
        setStatus(data.length === 0 ? "empty" : "content");
      })
      .catch((err) => {
        console.log("API ERROR:", err);
        setProblem(problemFor(err));
        setStatus("error");
      });
  }, 3000);
}, [attempt]);

*/
