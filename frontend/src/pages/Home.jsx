import React, { useEffect, useState } from "react";
import { fetchProducts, fetchRecs } from "../api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { ShoppingBag, Moon, Sun, Send, Mail, Phone, MapPin } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
const TAGS = [
    "urban streetwear energy",
    "cozy Diwali glow-up",
    "effortlessly chic",
    "casual day out",
];
            {/* AI MOOD PICKS (Products first) */}
            export default function Home() {
                const [mood, setMood] = useState(TAGS[0]);
                const [recs, setRecs] = useState([]);
                const [products, setProducts] = useState([]);
                const { add, cart = [] } = useCart();
                const { dark, toggleTheme } = useTheme();

                useEffect(() => {
                    (async () => {
                        try {
                            setRecs(await fetchRecs(mood));
                            setProducts(await fetchProducts());
                        } catch (err) {
                            console.error(err);
                        }
                    })();
                }, [mood]);

                const fadeUp = {
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                };

                const fadeIn = {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.6 } },
                };

                const count = Array.isArray(cart)
                    ? cart.reduce((n, i) => n + (i.qty || 0), 0)
                    : 0;

                // Contact form state (modern UI/UX)
                const [contactName, setContactName] = useState("");
                const [contactEmail, setContactEmail] = useState("");
                const [contactMessage, setContactMessage] = useState("");
                const [contactSuccess, setContactSuccess] = useState(false);

                const handleContactSubmit = (e) => {
                    e.preventDefault();
                    // Simulate submit (no backend endpoint). In future integrate /api/contact.
                    console.log('Contact submit', { contactName, contactEmail, contactMessage });
                    setContactSuccess(true);
                    setContactName("");
                    setContactEmail("");
                    setContactMessage("");
                    setTimeout(() => setContactSuccess(false), 4500);
                };

                return (
                    <main className="relative max-w-7xl mx-auto px-4 py-8 space-y-12 bg-[#0a0a0a] text-gray-100">

                        {/* 🌙 Floating Action Buttons (Theme + Cart) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, y: -30 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="fixed top-5 right-6 flex flex-col gap-3 z-[9999]"
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleTheme}
                                aria-label="Toggle dark mode"
                                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                {dark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => (window.location.href = "/cart")}
                                aria-label="View cart"
                                className="relative p-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition"
                            >
                                <ShoppingBag size={22} />
                                {count > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-white text-orange-500 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                                        {count}
                                    </span>
                                )}
                            </motion.button>
                        </motion.div>

                        {/* PRODUCTS: NEW ARRIVALS */}
                        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold mb-6">New Arrivals</h2>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((p) => (
                                    <ProductCard key={p.id} p={p} onAdd={add} />
                                ))}
                            </div>
                        </motion.section>

                        {/* PRODUCTS: AI MOOD PICKS */}
                        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold mb-6">
                                AI Picks — <span className="text-orange-500">{mood}</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {recs.map((p) => (
                                    <ProductCard key={p.id} p={p} onAdd={add} />
                                ))}
                            </div>
                        </motion.section>
                        {/* TESTIMONIALS (moved under products) */}
                        <motion.section
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-center py-6"
                        >
                            <h2 className="text-3xl font-bold mb-6">What Our Customers Say</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    {
                                        name: "Aarav Sharma",
                                        text: "Nexora nails it! Their AI picks actually match my mood and style.",
                                    },
                                    {
                                        name: "Riya Kapoor",
                                        text: "Smooth shopping and fast checkout. I love how personalized it feels!",
                                    },
                                    {
                                        name: "Karan Mehta",
                                        text: "Finally, an e-commerce site that gets me. The recommendations are spot on.",
                                    },
                                ].map((t, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white/5 dark:bg-gray-900 border border-gray-800 rounded-lg p-4"
                                    >
                                        <p className="italic mb-3 text-gray-300">“{t.text}”</p>
                                        <h4 className="font-medium text-orange-500 text-sm">{t.name}</h4>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* CONTACT US (moved under products) */}
                        <motion.section
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 text-center"
                        >
                            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-8">
                                Got questions or feedback? We’d love to hear from you!
                            </p>

                            <form className="max-w-lg mx-auto grid gap-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                />
                                <textarea
                                    placeholder="Your Message"
                                    rows="4"
                                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                ></textarea>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition"
                                >
                                    <Send size={18} /> Send Message
                                </button>
                            </form>
                        </motion.section>

                        {/* NEWSLETTER */}
                        <motion.section
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-2xl"
                        >
                            <h2 className="text-3xl font-bold mb-3">Join Our Vibe Club</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Get early access to drops, AI styling tips, and exclusive discounts.
                            </p>
                            <div className="flex justify-center gap-2 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm"
                                />
                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm transition">
                                    Subscribe
                                </button>
                            </div>
                        </motion.section>

                        {/* HERO SECTION (moved below newsletter) */}
                        <motion.section
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 gap-6 items-center"
                        >
                            <div>
                                <h1 className="font-extrabold text-5xl mb-4 leading-tight">
                                    Where <span className="text-orange-500">Vibes</span> Meet Fashion
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6">
                                    Shop curated styles powered by AI. Discover fashion that matches
                                    your energy, your vibe, your world.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setMood(tag)}
                                            className={`px-4 py-2 rounded-full border text-sm capitalize transition ${mood === tag
                                                ? "bg-orange-500 text-white border-orange-500"
                                                : "bg-transparent text-gray-800 dark:text-gray-200 border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <img
                                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000"
                                alt="Hero"
                                className="rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm w-full max-h-80 object-cover"
                            />
                        </motion.section>

                        {/* FOOTER */}
                        <motion.footer
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-center py-8 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700"
                        >
                            <p>© {new Date().getFullYear()} Nexora. All rights reserved.</p>
                            <div className="flex justify-center gap-4 mt-3 text-sm">
                                <a href="#" className="hover:text-orange-500 transition">
                                    Privacy Policy
                                </a>
                                <a href="#" className="hover:text-orange-500 transition">
                                    Terms of Use
                                </a>
                                <a href="#" className="hover:text-orange-500 transition">
                                    Contact Us
                                </a>
                            </div>
                        </motion.footer>
                    </main>
                );
            }
