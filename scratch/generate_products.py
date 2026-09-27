import json
import random

categories = {
    "Chargers": ["Fast Chargers", "USB-C Chargers", "GaN Chargers", "Wireless Chargers", "Car Chargers", "Laptop Chargers"],
    "Cables": ["USB-C to USB-C", "USB-C to Lightning", "USB-A to USB-C", "Lightning", "Micro USB", "Braided Cables"],
    "Power": ["Power Banks", "MagSafe Power Banks", "Portable Power"],
    "Audio": ["Earbuds", "Headphones", "Speakers", "Wired Earphones"],
    "Phone Accessories": ["Phone Cases", "Screen Protectors", "Phone Stands", "MagSafe Accessories", "Car Mounts"],
    "Adapters & Hubs": ["USB Hubs", "HDMI Adapters", "USB Adapters", "Travel Adapters"],
    "Laptop Accessories": ["Laptop Chargers", "USB-C Hubs", "Cooling Accessories", "Stands"]
}

image_pools = {
    "Chargers": [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=900&q=80"
    ],
    "Cables": [
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80"
    ],
    "Power": [
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1583863788434-e2529d5f54f3?auto=format&fit=crop&w=900&q=80"
    ],
    "Audio": [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80"
    ],
    "Phone Accessories": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80"
    ],
    "Adapters & Hubs": [
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80"
    ],
    "Laptop Accessories": [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1517059221160-246a84c76f2b?auto=format&fit=crop&w=900&q=80"
    ]
}

def get_image_set(category, product_id):
    category_pool = image_pools.get(category, image_pools["Chargers"])
    image = category_pool[(product_id - 1) % len(category_pool)]
    images = [
        category_pool[(product_id - 1 + offset) % len(category_pool)]
        for offset in range(3)
    ]
    return image, images

brands = ["VoltCart", "VoltCart Pro", "VoltCart Elite", "VoltCart Basics"]

adjectives = ["Ultra", "Pro", "Max", "Premium", "Compact", "Heavy Duty", "Braided", "Magnetic", "Smart", "Rapid", "Eco"]

visual_groups = {
    "Chargers": [
        {"category": "Chargers", "subcategory": "USB-C Wall Chargers", "name": "USB-C Wall Charger", "images": ["1731616103600-3fe7ccdc5a59"]}
    ],
    "Cables": [
        {"category": "Cables", "subcategory": "USB-C Cables", "name": "USB-C Cable", "images": ["1603539444875-76e7684265f6"]}
    ],
    "Power": [
        {"category": "Power", "subcategory": "Power Banks", "name": "Portable Power Bank", "images": ["1644571669401-9ab344866592"]}
    ],
    "Audio": [
        {"category": "Audio", "subcategory": "Over-Ear Headphones", "name": "Over-Ear Headphones", "images": ["1583394838336-acd977736f90", "1546435770-a3e426bf472b", "1505740420928-5e560c06d30e", "1524678606370-a47ad25cb82a"]},
        {"category": "Audio", "subcategory": "In-Ear Earphones", "name": "In-Ear Earphones", "images": ["1484704849700-f032a568e944"]}
    ],
    "Phone Accessories": [
        {"category": "Mobile Devices", "subcategory": "Smartphones", "name": "Smartphone", "images": ["1609091839311-d5365f9ff1c5", "1586953208448-b95a79798f07", "1511707171634-5f897ff02aa9", "1598327105666-5b89351aff97", "1512941937669-90a1b58e7e9c"]},
        {"category": "Wearables", "subcategory": "Smartwatches", "name": "Smartwatch", "images": ["1523275335684-37898b6baf30", "1546868871-7041f2a55e12"]}
    ],
    "Adapters & Hubs": [
        {"category": "Computer Components", "subcategory": "Motherboards", "name": "Computer Motherboard", "images": ["1518770660439-4636190af475"]}
    ],
    "Laptop Accessories": [
        {"category": "Computers & Gaming", "subcategory": "Laptops", "name": "Laptop Computer", "images": ["1496181133206-80ce9b88a853", "1517336714731-489689fd1ca8", "1516321318423-f06f85e504b3", "1611078489935-0cb964de46d6"]},
        {"category": "Computers & Gaming", "subcategory": "Gaming Keyboards", "name": "RGB Gaming Keyboard", "images": ["1603302576837-37561b2e2302"]},
        {"category": "Computers & Gaming", "subcategory": "Gaming Monitors", "name": "Gaming Monitor", "images": ["1625842268584-8f3296236761"]}
    ]
}

products = []
id_counter = 1

for category, subcategories in categories.items():
    for subcategory in subcategories:
        # Generate 3-5 products per subcategory
        num_products = random.randint(3, 6)
        for _ in range(num_products):
            brand = random.choice(brands)
            adj = random.choice(adjectives)
            name = f"{brand} {adj} {subcategory}"
            
            # Special naming logic
            if "GaN" in subcategory:
                watts = random.choice(["30W", "45W", "65W", "100W", "140W"])
                name = f"{brand} {watts} GaN Fast Charger"
            elif "Power Bank" in subcategory:
                capacity = random.choice(["5,000mAh", "10,000mAh", "20,000mAh", "30,000mAh"])
                name = f"{brand} {adj} Power Bank {capacity}"
            elif "Cable" in subcategory or "Lightning" in subcategory or "Micro USB" in subcategory:
                length = random.choice(["3ft", "6ft", "10ft", "1m", "2m"])
                name = f"{brand} {adj} {subcategory} ({length})"
            
            base_price = random.randint(8, 60)

            # Keep demo pricing plausible for a US-dollar storefront.
            if category == "Power": base_price = random.randint(20, 100)
            elif category == "Cables": base_price = random.randint(5, 25)
            elif "Laptop" in category or "Laptop" in subcategory: base_price = random.randint(25, 180)
            elif category == "Audio": base_price = random.randint(15, 180)
            elif "GaN" in subcategory: base_price = random.randint(20, 120)

            discount = random.choice([0, 0, 0, 10, 15, 20, 25, 30, 50])
            price = int(base_price * (1 - discount/100))
            oldPrice = base_price if discount > 0 else None
            
            rating = round(random.uniform(3.8, 5.0), 1)
            reviews = random.randint(5, 5000)
            
            compatibility_options = ["iPhone", "Samsung", "Android", "iPad", "MacBook", "Laptop", "Universal"]
            if "Lightning" in name:
                compat = ["iPhone", "iPad"]
            elif "MacBook" in name or "Laptop" in name:
                compat = ["MacBook", "Laptop"]
            elif "MagSafe" in name:
                compat = ["iPhone"]
            else:
                compat = random.sample(compatibility_options, random.randint(1, 4))
                if "Universal" in compat: compat = ["Universal"]
                
            badge = random.choice([None, None, "Best Seller", "New", "Limited Stock", "Sale"])
            if discount >= 30: badge = "Sale"
            
            image, images = get_image_set(category, id_counter)
            description = f"Experience premium quality with the {name}. Designed for maximum performance and reliability. Built by VoltCart to keep you powered up and connected wherever you go."
            
            product = {
                "id": id_counter,
                "name": name,
                "category": category,
                "subcategory": subcategory,
                "price": price,
                "oldPrice": oldPrice,
                "discount": discount,
                "rating": rating,
                "reviews": reviews,
                "compatibility": compat,
                "badge": badge,
                "image": image,
                "images": images,
                "description": description,
                "stock": random.randint(0, 150)
            }
            
            products.append(product)
            id_counter += 1

visual_group_counts = {}
brand_prefixes = sorted(brands, key=len, reverse=True)
for product in products:
    source_category = product["category"]
    groups = visual_groups.get(source_category)
    if not groups:
        continue

    group_index = visual_group_counts.get(source_category, 0)
    visual_group_counts[source_category] = group_index + 1
    group = groups[group_index % len(groups)]
    image_ids = group["images"]
    image_id = image_ids[(group_index // len(groups)) % len(image_ids)]
    gallery_ids = group["images"]
    brand = next((prefix for prefix in brand_prefixes if product["name"].startswith(prefix)), "VoltCart")
    image_url = f"https://images.unsplash.com/photo-{image_id}?auto=format&fit=crop&w=900&q=80"

    product["category"] = group["category"]
    product["subcategory"] = group["subcategory"]
    product["name"] = f"{brand} {group['name']} {product['id']:03d}"
    product["image"] = image_url
    product["images"] = [
        f"https://images.unsplash.com/photo-{gallery_id}?auto=format&fit=crop&w=900&q=80"
        for gallery_id in gallery_ids
    ]
    product["description"] = f"{group['name']} for everyday use, selected by VoltCart."

js_content = f"const products = {json.dumps(products, indent=4)};\n\nglobalThis.products = products;\nif (typeof window !== 'undefined') window.products = products;\nif (typeof module !== 'undefined') module.exports = products;"

with open("static/js/products.js", "w", encoding="utf-8") as f:
    f.write(js_content)
    
print(f"Generated {len(products)} products.")
