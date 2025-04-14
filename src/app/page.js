"use client"
import HomePage from "@/components/home";
// import 'bootstrap/dist/css/bootstrap.min.css';
import ClientProvider from "./client-provider";

export default function MainPage() {
    return (
        <ClientProvider>
        <HomePage />
      </ClientProvider>
    )
}
