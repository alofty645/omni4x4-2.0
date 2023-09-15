import scrapy


class A4wdsupacentreSpider(scrapy.Spider):
    name = "4wdsupacentre"
    allowed_domains = ["4wdsupacentre.com.au"]
    start_urls = ["https://4wdsupacentre.com.au/products.html?page=1"]

    def parse(self, response):
        pass
