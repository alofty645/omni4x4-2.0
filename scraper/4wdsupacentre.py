from urllib import response
from selenium import webdriver
from time import sleep
from selenium.webdriver.chrome.options import Options
from scrapy import Selector
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from supabase import create_client, Client

# create Supabase client
url = "https://oekeyzwvxekuznfupkka.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la2V5end2eGVrdXpuZnVwa2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI1OTAxMjgsImV4cCI6MTk5ODE2NjEyOH0.JYFSf-xymsOm0FlbN4XtFieFY9hD5PzCgYcbIJ6NogU"
supabase: Client = create_client(url, key)

# Setting up the driver
chromeOptions = Options()
chromeOptions.add_experimental_option("excludeSwitches", ["enable-logging"])
chromeOptions.add_argument("--headless")
chromePath = "chromedriver.exe"
driver = webdriver.Chrome(options=chromeOptions)
driver.maximize_window()

# Get the total number of pages
driver.get("https://www.4wdsupacentre.com.au/products.html?page=1&pageSize=36")
WebDriverWait(driver, 30).until(
    EC.presence_of_element_located(
        (By.XPATH, '//div[@class="itemCountContainerB-3Hm itemCountContainerBTop-3Nx"]')
    )
)
response = Selector(text=driver.page_source)
products = response.xpath(
    '//div[@class="itemCountContainerB-3Hm itemCountContainerBTop-3Nx"]/text()'
).extract_first()
products = products.strip()
products = products.split(" ")
products = products[-1]
products = int(products)
total_pages = products // 36

if products % 36 != 0:
    total_pages += 1


# Initialize data lists to store scraped data
product_data_buffer = []
price_data_buffer = []
PAGE_BUFFER_SIZE = 500  # Set the buffer size

for i in range(1, total_pages + 1):
    link = f"https://www.4wdsupacentre.com.au/products.html?page={i}&pageSize=36"
    driver.get(link)
    WebDriverWait(driver, 30).until(
        EC.presence_of_element_located((By.XPATH, '//div[@class="root-2fi null"]'))
    )
    response = Selector(text=driver.page_source)

    listings = response.xpath('//div[@class="root-2fi null"]')

    for listing in listings:
        # Scraping data
        product_name = listing.xpath(
            './/div[@class="name-1QF"]/a/text()'
        ).extract_first()
        product_link = (
            "https://www.4wdsupacentre.com.au"
            + listing.xpath('.//div[@class="name-1QF"]/a/@href').extract_first()
        )
        product_price = listing.xpath(
            './/div[@class="priceLine-1H-"]/div/span/text()'
        ).extract()
        shipping_price = listing.xpath(
            './/span[@class="freightvalue-2VW"]/span/text()'
        ).extract()

        if product_price:
            product_price = (
                "".join(product_price).strip().replace("$", "").replace(",", "")
            )
            product_price = float(product_price)
        else:
            product_price = 0.0

        if shipping_price:
            shipping_price = "".join(shipping_price)
            shipping_price = shipping_price.strip()
            shipping_price = shipping_price.replace("+ ", "")
            shipping_price = float(shipping_price.replace("$", "").replace(",", ""))
        else:
            shipping_price = 0

        # Append data to buffers
        product_data_buffer.append(
            {"product_name": product_name, "product_link": product_link}
        )
        price_data_buffer.append(
            {
                "product_price": product_price,
                "shipping_price": shipping_price,
                "product_link": product_link,
            }
        )
        # print("-------------------------------------------------------------------")
        # print("Page Number: ", i)
        # print("Product Link: ", product_link)
        # print("Product Name: ", product_name)
        # print("Product Price: ", product_price)
        # print("Shipping Price: ", shipping_price)
        # print("-------------------------------------------------------------------")

        # Check if it's time to perform bulk writes
        if len(product_data_buffer) >= PAGE_BUFFER_SIZE:
            # Perform bulk API writes
            product_insert = (
                supabase.table("product").upsert(product_data_buffer).execute()
            )
            price_insert = supabase.table("price").insert(price_data_buffer).execute()

            # Clear the buffers
            product_data_buffer = []
            price_data_buffer = []

# Perform any remaining bulk writes
if product_data_buffer:
    product_insert = supabase.table("product").upsert(product_data_buffer).execute()
if price_data_buffer:
    price_insert = supabase.table("price").insert(price_data_buffer).execute()

# Close the driver
driver.close()
driver.quit()

print("The Scraping has finished successfully!")
