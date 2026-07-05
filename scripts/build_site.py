#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
from datetime import datetime, timezone
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
CONTENT = ROOT / "content"
DIST = ROOT / "dist"
BASE_URL = "https://www.zmasterpro.com"
ASSET_VERSION = "20260705-floating"
BRAND = "支先森制造"
BRAND_ALT = "ZMaster Pro"
DEFAULT_CONTACT = {
    "wechat": "zmaster2012",
    "phone": "13340018003",
    "email": "mrz.design@qq.com",
    "city": "江西南昌",
}
DEFAULT_FLOATING_CONTACT = {
    "kicker": "QUICK QUOTE",
    "title": "定制咨询",
    "body": "街舞校服、赛事服、潮牌小单先发需求，我们帮你拆报价路径。",
    "primaryLabel": "发需求",
    "secondaryLabel": "打电话",
}


def load_site_settings() -> dict:
    settings_path = CONTENT / "site.json"
    data = {}
    if settings_path.exists():
        data = json.loads(settings_path.read_text(encoding="utf-8"))
    contact = DEFAULT_CONTACT.copy()
    contact.update(data.get("contact", {}))
    floating = DEFAULT_FLOATING_CONTACT.copy()
    floating.update(data.get("floatingContact", {}))
    return {"contact": contact, "floatingContact": floating}


SITE_SETTINGS = load_site_settings()
CONTACT = SITE_SETTINGS["contact"]
FLOATING_CONTACT = SITE_SETTINGS["floatingContact"]

KEYWORDS = [
    "支先森制造",
    "支先森製造",
    "ZMaster Pro",
    "街舞服装定制",
    "街舞校服定制",
    "服装定制",
    "潮牌定制",
    "小单定制",
    "T恤定制",
    "卫衣定制",
    "班服定制",
    "队服定制",
    "老师工作服定制",
    "服装 OEM ODM",
    "南昌服装工厂",
]

NAV = [
    ("/", "首页"),
    ("/about", "关于我们"),
    ("/services", "定制服务"),
    ("/cases", "案例展示"),
    ("/faq", "常见问题"),
    ("/contact", "联系合作"),
]

SERVICE_PAGES = [
    {
        "path": "/clothing-customization",
        "nav": "服装定制",
        "h1": "街舞机构服装定制",
        "title": "街舞机构服装定制｜校服、队服、演出服、小单定制｜支先森制造",
        "description": "支先森制造提供街舞机构服装定制，覆盖机构校服、班服队服、老师工作服、演出服、赛事服、活动服和街舞周边，从设计效果图到打样生产一站式交付。",
        "summary": "街舞机构服装定制，是把机构日常训练、招生展示、演出比赛和品牌传播统一到一套可长期复用的服装系统里。支先森制造会根据机构定位、学员年龄、预算和交期，协助确认款式、面料、颜色、工艺、尺码和补货方式。",
        "suitable": ["街舞学校和少儿舞蹈机构", "街舞赛事活动主办方", "舞团、老师团队和机构门店", "需要长期补货的连锁机构", "希望做机构周边或联名款的品牌方"],
        "categories": ["机构校服", "班服和队服", "老师工作服", "演出服和比赛服", "赛事活动服", "冠军纪念款", "帽子、毛巾、袜子、包袋等周边"],
        "needs": ["机构 logo 或品牌标准色", "参考款式、图案、尺码范围", "预计数量和是否需要补货", "目标交期、收货城市和预算区间", "是否需要设计效果图、打样或包装辅料"],
        "price_factors": ["品类和面料克重", "数量和尺码跨度", "印花、刺绣、烫画、辅料等工艺复杂度", "是否需要打样和改样", "包装、吊牌、领标、物流和交期要求"],
        "process": ["需求沟通：确认使用场景、数量、预算和交期", "款式方案：确定版型、颜色、面料和工艺", "效果图/报价：整理图案位置、尺码和报价明细", "打样确认：按项目需要先做样衣或工艺样", "大货生产：排产、跟单、质检和包装", "发货补货：发出货品并保留款式资料，方便长期补货"],
        "cycle": "生产周期需要在款式、数量、工艺、面料库存和打样次数确认后确定。常规定制通常先确认打样周期，再确认大货排产时间；活动、比赛和开学季项目建议提前预留沟通、打样、修改和物流时间。",
        "service_type": "街舞机构服装定制",
    },
    {
        "path": "/t-shirt-customization",
        "nav": "T 恤定制",
        "h1": "街舞 T 恤定制",
        "title": "街舞 T 恤定制｜班服、队服、机构校服、潮牌小单｜支先森制造",
        "description": "支先森制造提供街舞 T 恤定制，适合班服队服、街舞机构校服、夏季训练服、赛事纪念款、活动服、潮牌小单和品牌联名款。",
        "summary": "街舞 T 恤定制适合高频穿着、活动传播和低门槛品牌周边。支先森制造可根据穿着场景选择纯棉、速干或高克重面料，并匹配丝网印、数码直喷、烫画、发泡印等工艺。",
        "suitable": ["街舞机构夏季校服", "班服、队服和训练服", "街舞赛事活动纪念款", "舞团和老师团队统一服装", "潮牌、小单品牌和联名项目"],
        "categories": ["230g/240g 纯棉 T 恤", "300g 高克重街头版型 T 恤", "速干训练 T 恤", "宽松落肩 T 恤", "活动 T 恤和纪念 T 恤", "童装尺码 T 恤"],
        "needs": ["T 恤款式参考或版型偏好", "图案源文件、logo、文字内容", "颜色、尺码和数量", "印花位置和工艺偏好", "预算、交期和收货地址"],
        "price_factors": ["面料克重和成衣版型", "图案尺寸、颜色数量和印花位置", "丝网印、数码直喷、烫画等工艺选择", "单款数量和是否混码", "包装辅料、吊牌和物流要求"],
        "process": ["确认场景：训练、班服、队服、赛事或潮牌销售", "选择面料版型：纯棉、速干、高克重或童装尺码", "整理图案：确认正面、背面、袖口和领标位置", "报价打样：按数量和工艺给出报价，必要时先打样", "生产质检：印花、整烫、包装和抽检", "交付复盘：保留图案和工艺资料，便于追加补货"],
        "cycle": "T 恤周期受图案复杂度、面料现货、数量和是否打样影响。若需要赶活动或比赛，请尽早提供完整设计资料，先锁定成衣、图案和尺码后再确认排产。",
        "service_type": "街舞 T 恤定制",
    },
    {
        "path": "/hoodie-customization",
        "nav": "卫衣定制",
        "h1": "街舞卫衣定制",
        "title": "街舞卫衣定制｜机构秋冬校服、老师团队服、潮牌卫衣｜支先森制造",
        "description": "支先森制造提供街舞卫衣定制，适合街舞机构秋冬校服、老师团队服、周年纪念款、赛事周边、潮牌卫衣和小单定制。",
        "summary": "街舞卫衣定制更适合秋冬校服、老师团队服、周年纪念和品牌款。相比普通活动服，卫衣更重视版型、克重、帽绳、罗纹、图案工艺和长期穿着后的稳定性。",
        "suitable": ["街舞机构秋冬校服", "老师团队和门店工作服", "周年庆、毕业季和冠军纪念款", "赛事周边和品牌联名款", "潮牌卫衣小单生产"],
        "categories": ["套头卫衣", "连帽卫衣", "拉链卫衣", "高克重宽松卫衣", "儿童尺码卫衣", "卫裤和套装延展"],
        "needs": ["卫衣款式、克重和版型偏好", "logo、图案文件和配色", "帽绳、罗纹、口袋等细节要求", "数量、尺码、交期和预算", "是否需要吊牌、领标、洗水标和包装袋"],
        "price_factors": ["面料克重和成衣结构", "刺绣、印花、贴布、发泡印等工艺", "图案面积、位置和颜色数量", "辅料定制和包装要求", "样衣修改次数、数量和交期"],
        "process": ["定位款式：校服、老师服、纪念款或品牌款", "确认面料：克重、手感、颜色和尺码体系", "确认工艺：印花、刺绣、贴布和细节辅料", "报价打样：确认样衣、颜色和图案效果", "大货生产：裁片、工艺、缝制、质检和包装", "资料留存：保存版型和辅料资料，方便补单"],
        "cycle": "卫衣生产周期通常比 T 恤更依赖面料、辅料和打样确认。需要先明确是否使用现货成衣、半定制还是全定制，再根据数量、工艺和排产档期确认交付时间。",
        "service_type": "街舞卫衣定制",
    },
    {
        "path": "/workwear-customization",
        "nav": "工作服定制",
        "h1": "街舞机构老师工作服定制",
        "title": "街舞机构老师工作服定制｜Polo、T恤、卫衣、门店工服｜支先森制造",
        "description": "支先森制造提供街舞机构老师工作服定制，覆盖老师 Polo、T 恤、卫衣、夹克、赛事工作人员服和门店形象服。",
        "summary": "老师工作服不只是统一着装，更关系到门店专业感、招生接待、课程交付和活动现场识别。支先森制造会平衡街舞气质、日常耐穿、门店管理和老师穿着舒适度。",
        "suitable": ["街舞机构老师团队", "门店前台和课程顾问", "赛事活动工作人员", "连锁校区和巡店团队", "需要统一视觉的招生团队"],
        "categories": ["老师 Polo", "老师 T 恤", "门店卫衣", "夹克外套", "赛事工作人员服", "招生接待服和团队套装"],
        "needs": ["门店使用场景和岗位区分", "logo、机构色和印绣位置", "老师尺码表和数量", "是否需要不同校区、岗位或批次区分", "交期、预算和补货预期"],
        "price_factors": ["品类、面料和版型", "印花、刺绣、袖标、胸标等工艺", "是否区分岗位、校区和颜色", "数量、尺码跨度和补货频率", "包装、发货分校区和交付时间"],
        "process": ["梳理岗位：老师、前台、活动人员和管理团队", "确定风格：专业、街头、简洁或赛事识别", "确认款式：Polo、T 恤、卫衣、夹克或套装", "整理报价：按岗位、数量和工艺拆分报价", "样衣确认：重点看上身效果和门店统一感", "批量交付：按校区、岗位或尺码分包发货"],
        "cycle": "老师工作服周期需要结合岗位数量、分校区发货和是否补货来确定。若涉及多岗位、多校区，建议先做尺码收集表，再确认打样和大货时间。",
        "service_type": "街舞机构老师工作服定制",
    },
    {
        "path": "/oem-odm",
        "nav": "OEM / ODM",
        "h1": "街舞服装 OEM / ODM",
        "title": "街舞服装 OEM / ODM｜潮牌小单、来图打样、品牌服装生产｜支先森制造",
        "description": "支先森制造提供街舞服装 OEM / ODM 服务，支持潮牌小单、来图打样、品牌联名、赛事周边、T 恤卫衣夹克帽子和包装辅料定制。",
        "summary": "OEM / ODM 适合已经有品牌想法、图案方案或销售渠道的客户。支先森制造可以按来图打样，也可以协助把一个风格方向延展成 T 恤、卫衣、帽子、包袋和包装辅料组合。",
        "suitable": ["街舞潮牌和小单品牌", "舞者个人品牌", "赛事 IP 和机构周边", "海外街舞客户和买手项目", "需要来图打样或款式开发的团队"],
        "categories": ["T 恤、Polo、卫衣", "夹克、外套和套装", "帽子、袜子、毛巾、包袋", "领标、洗水标、吊牌和包装袋", "品牌联名和赛事周边系列"],
        "needs": ["品牌定位、参考图或设计稿", "目标品类、数量和尺码范围", "面料、版型、工艺和包装要求", "预算、目标售价和交期", "是否需要保密、分批交付或长期补货"],
        "price_factors": ["开发深度：来图生产、打样修改或 ODM 延展", "面料、辅料和版型复杂度", "单款数量、颜色数量和尺码跨度", "工艺、包装和品牌辅料要求", "测试、改样、分批生产和物流方式"],
        "process": ["确认品牌方向：人群、风格、售价和销售渠道", "建立产品清单：品类、颜色、尺码和数量", "打样开发：确认版型、面料、工艺和包装", "成本核算：按单款拆解面料、工艺、辅料和物流", "大货生产：采购、排产、质检、包装和发货", "复盘迭代：根据销售反馈调整尺码、面料和补货计划"],
        "cycle": "OEM / ODM 周期取决于开发深度。来图生产通常先确认图案和工艺；ODM 系列开发还需要预留款式企划、打样、改样、辅料确认和生产排期。",
        "service_type": "街舞服装 OEM / ODM",
    },
]

FAQS = [
    ("支先森制造主要做什么？", "支先森制造专注街舞机构服装定制，服务街舞学校、少儿舞蹈机构、赛事活动、老师团队、舞团、舞者个人品牌和街舞潮牌客户。"),
    ("可以做哪些品类？", "常见品类包括 T 恤、速干训练服、Polo、卫衣、外套、老师工作服、比赛服、赛事服、冠军纪念款、帽子、毛巾、袜子、包袋、地胶和包装辅料。"),
    ("可以做班服、队服和小单定制吗？", "可以。班服、队服、街舞校服、潮牌小单和活动纪念款都可以沟通，具体起订量、价格和周期需要结合品类、数量、工艺和面料确认。"),
    ("可以帮忙做设计效果图吗？", "可以。你可以提供机构 logo、参考图、想要的风格和使用场景，我们会先梳理款式、配色、图案位置和工艺方向，再进入报价或打样沟通。"),
    ("报价需要提供什么信息？", "报价通常需要品类、数量、面料、颜色、尺码范围、图案文件、工艺、包装需求、交期和收货城市。信息越完整，报价越准确。"),
    ("能不能先打样？", "可以根据项目需求安排打样。打样前需要先确认款式、面料、图案、工艺和费用规则，样衣确认后再进入大货生产。"),
    ("适合长期补货吗？", "适合。机构校服、老师服和长期训练服可以按系列思路建立款式、颜色、尺码和工艺记录，后续补货会更稳定。"),
    ("印花、刺绣、烫画怎么选？", "选择取决于图案复杂度、预算、数量、面料和穿着强度。大面积图案常见丝网印或数码方案，胸标、帽子和局部细节常用刺绣或毛巾绣。"),
    ("怎么联系支先森制造？", f"可以添加微信 {CONTACT['wechat']}，拨打 {CONTACT['phone']}，或发送邮件到 {CONTACT['email']}。咨询时建议同时提供款式图、数量、交期和预算方向。"),
]


def route_url(path: str) -> str:
    if path == "/":
        return BASE_URL + "/"
    return BASE_URL + path


def h(text: str) -> str:
    return escape(text, quote=True)


def page_file(path: str) -> Path:
    if path == "/":
        return DIST / "index.html"
    return DIST / path.strip("/") / "index.html"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def load_json(path: Path, fallback):
    if not path.exists():
        return fallback
    return json.loads(path.read_text(encoding="utf-8"))


def load_cases() -> list[dict]:
    fallback = [
        {
            "title": "街舞机构夏季校服",
            "category": "街舞机构 / 少儿舞蹈",
            "image": "/images/hero-production.jpg",
            "summary": "适合日常训练、招生展示、校区统一和暑期活动。",
            "craft": "230g 纯棉 T 恤、速干训练服、成人童装混码、长期补货",
            "scenario": "连锁校区、少儿街舞机构、暑期集训、机构统一校服",
            "href": "/clothing-customization",
        }
    ]
    cases = load_json(CONTENT / "cases.json", fallback)
    return [case for case in cases if case.get("title")]


def nav_html(current_path: str) -> str:
    items = []
    for href, label in NAV:
        current = ' aria-current="page"' if href == current_path else ""
        items.append(f'<a href="{href}"{current}>{h(label)}</a>')
    return "".join(items)


def breadcrumbs_html(path: str, title: str) -> str:
    if path == "/":
        items = '<span>首页</span>'
    else:
        items = f'<a href="/">首页</a><span>/</span><span>{h(title)}</span>'
    return f'<nav class="breadcrumbs" aria-label="面包屑导航">{items}</nav>'


def breadcrumb_ld(path: str, title: str) -> dict:
    elements = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "首页",
            "item": route_url("/"),
        }
    ]
    if path != "/":
        elements.append(
            {
                "@type": "ListItem",
                "position": 2,
                "name": title,
                "item": route_url(path),
            }
        )
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": elements,
    }


def organization_ld() -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": f"{BASE_URL}/#organization",
        "name": BRAND,
        "alternateName": ["ZMaster", "ZMaster Pro", "Keeping Gear", "支先森製造"],
        "url": BASE_URL,
        "email": CONTACT["email"],
        "telephone": CONTACT["phone"],
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "南昌",
            "addressRegion": "江西",
            "addressCountry": "CN",
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "服装定制咨询",
            "telephone": CONTACT["phone"],
            "email": CONTACT["email"],
            "availableLanguage": ["zh-CN", "en"],
        },
    }


def website_ld() -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": f"{BASE_URL}/#website",
        "url": BASE_URL,
        "name": BRAND,
        "description": "支先森制造专注街舞机构服装定制，服务街舞学校、舞蹈机构、赛事活动与街舞品牌。",
        "publisher": {"@id": f"{BASE_URL}/#organization"},
    }


def service_ld(page: dict) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": f"{route_url(page['path'])}#service",
        "name": page["h1"],
        "serviceType": page["service_type"],
        "provider": {"@id": f"{BASE_URL}/#organization", "name": BRAND},
        "areaServed": ["中国", "海外街舞客户"],
        "audience": {
            "@type": "Audience",
            "audienceType": "、".join(page["suitable"]),
        },
        "description": page["description"],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": page["h1"] + "品类",
            "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": item}}
                for item in page["categories"]
            ],
        },
    }


def faq_ld() -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {"@type": "Answer", "text": answer},
            }
            for question, answer in FAQS
        ],
    }


def json_ld_tags(items: list[dict]) -> str:
    scripts = []
    for item in items:
        data = json.dumps(item, ensure_ascii=False, separators=(",", ":"))
        data = data.replace("</", "<\\/")
        scripts.append(f'<script type="application/ld+json">{data}</script>')
    return "\n".join(scripts)


def layout(page: dict, main: str, extra_ld: list[dict] | None = None) -> str:
    path = page["path"]
    title = page["title"]
    desc = page["description"]
    canonical = route_url(path)
    ld_items = [breadcrumb_ld(path, page["h1"])]
    if extra_ld:
        ld_items.extend(extra_ld)
    keywords = ", ".join(KEYWORDS + page.get("keywords", []))
    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{h(title)}</title>
  <meta name="description" content="{h(desc)}">
  <meta name="keywords" content="{h(keywords)}">
  <meta name="application-name" content="{BRAND}">
  <meta name="theme-color" content="#080a0d">
  <link rel="canonical" href="{canonical}">
  <meta property="og:title" content="{h(title)}">
  <meta property="og:description" content="{h(desc)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:site_name" content="{BRAND}">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:type" content="website">
  <meta property="og:image" content="{BASE_URL}/images/hero-production.jpg">
  <meta property="og:image:alt" content="支先森制造街舞机构服装定制工厂">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{h(title)}">
  <meta name="twitter:description" content="{h(desc)}">
  <meta name="twitter:image" content="{BASE_URL}/images/hero-production.jpg">
  <link rel="stylesheet" href="/assets/styles.css?v={ASSET_VERSION}">
  {json_ld_tags(ld_items)}
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="支先森制造首页">
        <span class="brand-mark">Z</span>
        <span><span class="brand-name">{BRAND}</span><span class="brand-sub">{BRAND_ALT}</span></span>
      </a>
      <nav class="nav" aria-label="主导航">{nav_html(path)}</nav>
      <a class="button header-cta" href="/contact">微信报价</a>
    </div>
  </header>
  {main}
  {cta_html()}
  {footer_html()}
  {floating_contact_html()}
  <div class="mobile-quickbar" aria-label="快速联系">
    <a href="/contact">微信报价</a>
    <a href="tel:{CONTACT["phone"]}">电话咨询</a>
  </div>
</body>
</html>
"""


def page_hero(page: dict, kicker: str) -> str:
    return f"""<section class="page-hero">
  <div class="container">
    {breadcrumbs_html(page["path"], page["h1"])}
    <span class="eyebrow">{h(kicker)}</span>
    <h1>{h(page["h1"])}</h1>
    <p class="lead">{h(page["description"])}</p>
  </div>
</section>"""


def card(title: str, body: str, href: str | None = None) -> str:
    link = f'<a class="card-link" href="{href}">查看详情</a>' if href else ""
    return f'<article class="card"><h3>{h(title)}</h3><p>{h(body)}</p>{link}</article>'


def ul(items: list[str]) -> str:
    return '<ul class="list">' + "".join(f"<li>{h(item)}</li>" for item in items) + "</ul>"


def cta_html() -> str:
    return f"""<section class="section cta">
  <div class="container cta-inner">
    <div>
      <span class="eyebrow">READY TO SAMPLE</span>
      <h2>把机构服装做成一套能长期复购的品牌装备</h2>
      <p>先发品类、数量、图案、预算和交期，我们会帮你把款式、面料、工艺、打样和大货路径拆清楚。</p>
    </div>
    <a class="button" href="/contact">发需求给支先森</a>
  </div>
</section>"""


def floating_contact_html() -> str:
    return f"""<aside class="floating-contact" aria-label="快速报价浮窗">
  <span class="floating-kicker">{h(FLOATING_CONTACT["kicker"])}</span>
  <strong>{h(FLOATING_CONTACT["title"])}</strong>
  <p>{h(FLOATING_CONTACT["body"])}<br>微信 {h(CONTACT["wechat"])}<br>电话 {h(CONTACT["phone"])}</p>
  <div class="floating-actions">
    <a href="/contact">{h(FLOATING_CONTACT["primaryLabel"])}</a>
    <a href="tel:{CONTACT["phone"]}">{h(FLOATING_CONTACT["secondaryLabel"])}</a>
  </div>
</aside>"""


def footer_html() -> str:
    service_links = "".join(f'<a href="{p["path"]}">{h(p["nav"])}</a>' for p in SERVICE_PAGES)
    page_links = "".join(f'<a href="{href}">{h(label)}</a>' for href, label in NAV)
    return f"""<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <strong>{BRAND} © 2026</strong>
      <p>街舞机构服装定制｜潮牌小单｜班服队服｜服装 OEM / ODM</p>
      <p>{CONTACT["city"]}，服务全国街舞机构、赛事活动、舞团、品牌方与海外客户。</p>
    </div>
    <div>
      <strong>站内页面</strong>
      <div class="footer-links">{page_links}</div>
    </div>
    <div>
      <strong>定制服务</strong>
      <div class="footer-links">{service_links}</div>
      <p>微信：{CONTACT["wechat"]}<br>电话：{CONTACT["phone"]}<br>邮箱：{CONTACT["email"]}</p>
    </div>
  </div>
</footer>"""


def home_page() -> dict:
    return {
        "path": "/",
        "h1": "支先森制造",
        "title": "支先森制造｜街舞机构与街头品牌定制生产伙伴｜ZMaster Pro",
        "description": "支先森制造服务街舞机构、赛事活动与街头品牌，支持机构校服、老师工作服、赛事服、T 恤卫衣、潮牌小单、品牌周边和服装 OEM/ODM，从款式企划、打样到大货生产一站式交付。",
        "keywords": ["街舞校服定制", "潮牌小单定制", "队服定制", "班服定制"],
    }


def render_home() -> str:
    services = [
        ("街舞机构校服", "日常训练、春夏秋冬换季、少儿尺码和长期补货，做得统一也要有街头感。", "/clothing-customization"),
        ("赛事与活动装备", "选手纪念款、工作人员服、冠军款、联名 T 恤和现场周边，围绕传播场景做。", "/t-shirt-customization"),
        ("老师团队工作服", "Polo、T 恤、卫衣、夹克和门店团队服，让专业感不牺牲街舞气质。", "/workwear-customization"),
        ("潮牌小单 / OEM", "来图打样、系列延展、吊牌领标、包装辅料和品牌补货，适合街头品牌试水。", "/oem-odm"),
        ("卫衣与秋冬系列", "高克重卫衣、连帽卫衣、拉链外套和团队套装，适合机构秋冬主推款。", "/hoodie-customization"),
        ("帽子与品牌周边", "帽子、毛巾、袜子、包袋、礼盒和地胶，把机构从校服延展成品牌装备。", "/services"),
    ]
    service_cards = "".join(
        f"""<a class="card service-card" href="{href}">
          <span class="card-kicker">CUSTOM</span>
          <h3>{h(title)}</h3>
          <p>{h(body)}</p>
          <span class="card-link">查看方案</span>
        </a>"""
        for title, body, href in services
    )
    process = [
        ("01 需求拆解", "先确认客户类型、使用场景、数量、预算、交期和是否需要长期补货。"),
        ("02 款式企划", "把版型、颜色、面料、图案位置、工艺和包装辅料整理成可报价方案。"),
        ("03 打样确认", "按项目复杂度做样衣或工艺样，确认上身效果、手感、颜色和印绣细节。"),
        ("04 大货交付", "排产、跟单、质检、分包发货，并保留款式资料，方便后续复购。"),
    ]
    process_cards = "".join(f'<article class="card process-card"><h3>{h(t)}</h3><p>{h(b)}</p></article>' for t, b in process)
    faq_preview = "".join(f'<div class="faq-item"><h3>{h(q)}</h3><p>{h(a)}</p></div>' for q, a in FAQS[:4])
    preview_cases = load_cases()[:3]
    case_preview_cards = "".join(
        f"""<article class="image-card">
          <img src="{h(case.get("image", "/images/hero-production.jpg"))}" alt="{h(case.get("title", "案例图片"))}" loading="lazy" decoding="async">
          <div>
            <span>{h(case.get("category", "案例方向"))}</span>
            <h3>{h(case.get("title", "定制案例"))}</h3>
            <p>{h(case.get("summary", ""))}</p>
          </div>
        </article>"""
        for case in preview_cases
    )
    page = home_page()
    main = f"""<main>
  <section class="hero">
    <div class="container hero-grid">
      <div>
        {breadcrumbs_html("/", "首页")}
        <span class="eyebrow">ZMASTER PRO CUSTOM LAB</span>
        <h1>街舞机构与街头品牌的定制生产伙伴</h1>
        <p class="lead">支先森制造把街舞审美、服装工艺和工厂交付放到一条链路里，服务机构校服、赛事活动、老师团队、潮牌小单、IP 周边和长期补货项目。</p>
        <div class="hero-actions">
          <a class="button" href="/contact">发需求快速报价</a>
          <a class="button secondary" href="/cases">先看案例方向</a>
        </div>
        <div class="tags">
          <span class="tag">街舞校服</span><span class="tag">赛事服</span><span class="tag">潮牌小单</span><span class="tag">老师工作服</span><span class="tag">T 恤卫衣</span><span class="tag">OEM / ODM</span>
        </div>
        <div class="hero-proof">
          <div><strong>4 条主线</strong><span>机构 / 赛事 / 潮牌 / 周边</span></div>
          <div><strong>一站交付</strong><span>企划 / 打样 / 生产 / 补货</span></div>
          <div><strong>全国服务</strong><span>江西南昌发全国</span></div>
        </div>
      </div>
      <div class="media-card hero-card">
        <img src="/images/hero-production.jpg" alt="支先森制造街舞机构服装定制工厂生产视觉" width="1672" height="941" fetchpriority="high" decoding="async">
        <div class="media-labels"><span>设计</span><span>打样</span><span>生产</span><span>补货</span></div>
        <div class="hero-note"><strong>从一件校服到一套品牌装备</strong><span>让机构穿出去更像一个有体系的品牌。</span></div>
      </div>
    </div>
  </section>
  <section class="section light studio-section">
    <div class="container">
      <div class="section-title">
        <h2>不是简单印 logo，而是做一套可传播的穿着系统</h2>
        <p>街舞机构要的是统一形象、招生展示、活动识别和长期补货；潮牌客户要的是款式感、工艺稳定和小单试错。我们把这两种需求放在同一个生产体系里解决。</p>
      </div>
      <div class="grid three">
        {card("机构品牌感", "让校服、老师服、赛事服和周边形成同一套视觉语言，日常训练也能成为品牌曝光。")}
        {card("工艺落地力", "根据预算和穿着强度选择纯棉、速干、高克重、丝网印、刺绣、烫画、包装辅料。")}
        {card("长期补货思路", "保留版型、颜色、尺码、图案和工艺资料，让机构复购不从零开始沟通。")}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-title">
        <h2>六类定制入口，覆盖机构和街头品牌的真实需求</h2>
        <p>从校服、班服、赛事服到潮牌小单、帽子周边和 OEM / ODM，先按客户场景拆方案，再进入报价、打样和生产。</p>
      </div>
      <div class="grid three">{service_cards}</div>
    </div>
  </section>
  <section class="section band">
    <div class="container split">
      <div>
        <span class="eyebrow">CRAFT SYSTEM</span>
        <h2>面料、版型、工艺和包装，一起决定高级感</h2>
        <p class="lead">同样是 T 恤或卫衣，克重、领口、肩线、图案位置、印绣方式、吊牌和包装都会影响客户拿到手的第一感受。</p>
        {ul(["高频训练款重视耐穿、透气和尺码覆盖", "活动赛事款重视识别度、交期和大批量稳定", "潮牌小单重视版型、细节工艺和包装完整度"])}
      </div>
      <div class="media-card"><img src="/images/craft-detail.jpg" alt="支先森制造印花刺绣面料辅料工艺细节" width="1536" height="1024" loading="lazy" decoding="async"></div>
    </div>
  </section>
  <section class="section light">
    <div class="container">
      <div class="section-title"><h2>从一句需求，到能交付的大货方案</h2><p>把模糊想法变成可报价、可打样、可生产的清单，减少来回沟通和踩坑成本。</p></div>
      <div class="grid four steps">{process_cards}</div>
    </div>
  </section>
  <section class="section case-preview">
    <div class="container">
      <div class="section-title">
        <h2>客户常见项目，可以这样做成案例</h2>
        <p>真实案例后续可以按这个结构补图、补数量、补工艺。现在先把客户最关心的方案方向展示清楚。</p>
      </div>
      <div class="grid three image-grid">
        {case_preview_cards}
      </div>
      <p class="section-action"><a class="button" href="/cases">查看案例展示</a></p>
    </div>
  </section>
  <section class="section light">
    <div class="container split">
      <div class="media-card"><img src="/images/case-collection.jpg" alt="Keeping Gear 街舞服装审美和产品集合" width="1254" height="1254" loading="lazy" decoding="async"></div>
      <div>
        <span class="eyebrow">KEEPING GEAR</span>
        <h2>用街头装备的审美，重做机构服装</h2>
        <p class="lead">Keeping Gear 是支先森长期打磨的街舞装备方向，它让校服、老师服、冠军纪念款和赛事周边不再像普通团服。</p>
        {ul(["把 lookbook 的款式感带入机构日常服", "让纪念款和联名款更适合传播", "帮助客户从基础校服升级到系列化装备"])}
      </div>
    </div>
  </section>
  <section class="section light">
    <div class="container">
      <div class="section-title"><h2>报价前最常被问到的问题</h2><p>把起订、打样、工艺、周期、补货这些问题提前说清楚，客户会更愿意开始沟通。</p></div>
      {faq_preview}
      <p><a class="button" href="/faq">查看全部 FAQ</a></p>
    </div>
  </section>
</main>"""
    return layout(page, main, [organization_ld(), website_ld()])


def render_about() -> str:
    page = {
        "path": "/about",
        "h1": "关于支先森制造",
        "title": "关于支先森制造｜街舞机构服装定制与潮牌小单生产",
        "description": "支先森制造是一家专注街舞机构服装定制的团队，服务街舞学校、舞蹈机构、赛事活动、老师团队、舞团、潮牌小单和服装 OEM/ODM 客户。",
        "keywords": ["关于支先森制造", "街舞服装工厂"],
    }
    main = f"""<main>
  {page_hero(page, "关于我们")}
  <section class="section light">
    <div class="container split">
      <div>
        <h2>更懂街舞客户，也更懂服装落地</h2>
        <p class="lead">支先森制造长期围绕街舞机构、舞者品牌和赛事活动做服装定制。我们的工作不是把 logo 简单印在衣服上，而是帮助客户把机构形象、街舞审美、面料工艺和生产交付统一起来。</p>
        {ul(["服务街舞学校、少儿舞蹈机构、赛事主办方、老师团队和舞者个人品牌", "覆盖 T 恤、卫衣、Polo、外套、老师工作服、赛事服、帽子和周边", "支持设计效果图、来图打样、工艺建议、生产跟单和长期补货"])}
      </div>
      <div class="media-card"><img src="/images/hero-production.jpg" alt="支先森制造服装生产与定制服务场景" width="1672" height="941" loading="lazy" decoding="async"></div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-title"><h2>我们适合什么客户</h2><p>如果你的需求和街舞、机构、团队形象、品牌周边或小单生产有关，支先森制造都可以先帮你把定制方案拆清楚。</p></div>
      <div class="grid three">
        {card("街舞机构", "需要校服、老师工作服、比赛服、活动服和长期补货的街舞学校、舞蹈机构、连锁校区。")}
        {card("赛事活动", "需要工作人员服、选手服、冠军纪念款、赛事周边和联名产品的活动主办方。")}
        {card("潮牌和小单", "需要 T 恤、卫衣、帽子、包袋、包装辅料、来图打样和 OEM/ODM 的品牌客户。")}
      </div>
    </div>
  </section>
</main>"""
    return layout(page, main)


def render_services() -> str:
    page = {
        "path": "/services",
        "h1": "定制服务总览",
        "title": "定制服务｜街舞服装定制、T恤卫衣、老师工作服、OEM/ODM｜支先森制造",
        "description": "查看支先森制造提供的街舞机构服装定制、T 恤定制、卫衣定制、老师工作服定制、潮牌小单和服装 OEM/ODM 服务。",
        "keywords": ["服装定制服务", "服装小单定制"],
    }
    cards = "".join(card(p["h1"], p["description"], p["path"]) for p in SERVICE_PAGES)
    main = f"""<main>
  {page_hero(page, "服务范围")}
  <section class="section light">
    <div class="container">
      <div class="section-title"><h2>从机构校服到潮牌小单</h2><p>每个服务页都回答服务是什么、适合谁、可以做什么、报价怎么受影响、流程和周期如何确认。</p></div>
      <div class="grid three">{cards}</div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-title"><h2>报价前建议准备的信息</h2><p>这些信息能帮助工厂更快判断可行性、价格区间和生产周期。</p></div>
      <div class="grid three">
        {card("基础信息", "品类、数量、尺码范围、颜色、目标交期、收货城市和预算方向。")}
        {card("设计资料", "机构 logo、图案源文件、参考款式、配色、文字内容和使用场景。")}
        {card("生产要求", "面料克重、印花刺绣工艺、包装辅料、是否打样、是否长期补货。")}
      </div>
    </div>
  </section>
</main>"""
    return layout(page, main)


def render_cases() -> str:
    page = {
        "path": "/cases",
        "h1": "案例展示",
        "title": "案例展示｜街舞校服、赛事服、潮牌小单、机构周边｜支先森制造",
        "description": "查看支先森制造面向街舞机构、赛事活动、老师团队、潮牌小单和机构周边的定制项目展示口径，覆盖校服、赛事服、T 恤卫衣、帽子包袋和品牌辅料。",
        "keywords": ["服装定制案例", "街舞校服案例"],
    }
    cases = load_cases()
    case_cards = "".join(
        f"""<article class="case-card">
          <img src="{h(case.get("image", "/images/hero-production.jpg"))}" alt="{h(case.get("title", "案例图片"))}" loading="lazy" decoding="async">
          <div class="case-card-body">
          <span>{h(case.get("category", "案例方向"))}</span>
          <h3>{h(case.get("title", "定制案例"))}</h3>
          <p>{h(case.get("summary", ""))}</p>
          <dl>
            <div><dt>工艺重点</dt><dd>{h(case.get("craft", ""))}</dd></div>
            <div><dt>适合场景</dt><dd>{h(case.get("scenario", ""))}</dd></div>
          </dl>
          </div>
        </article>"""
        for case in cases
    )
    main = f"""<main>
  {page_hero(page, "案例方向")}
  <section class="section light">
    <div class="container">
      <div class="section-title"><h2>按真实合作场景展示，而不是只放几张衣服照片</h2><p>定制客户最关心的是能不能做、怎么做、周期和预算怎么判断。案例页先用匿名项目口径展示能力，后续可继续补真实客户照片、数量和反馈。</p></div>
      <div class="case-board">{case_cards}</div>
    </div>
  </section>
  <section class="section">
    <div class="container split">
      <div class="media-card"><img src="/images/case-collection.jpg" alt="街舞潮牌服装和机构周边产品集合" width="1254" height="1254" loading="lazy" decoding="async"></div>
      <div>
        <span class="eyebrow">CASE METHOD</span>
        <h2>一个好案例，要让客户看到交付能力</h2>
        <p class="lead">好看的图只解决第一眼，真正影响成交的是是否适合穿、是否稳定生产、是否方便补货、是否能帮机构形成识别度。</p>
        {ul(["客户类型：街舞机构、赛事、老师团队、潮牌或周边", "产品清单：T 恤、卫衣、Polo、帽子、包袋和包装辅料", "交付信息：数量区间、工艺选择、打样逻辑和复购方式", "结果反馈：上身效果、活动传播、门店统一和后续补货"])}
        <p class="section-action"><a class="button" href="/contact">把你的项目做成下一个案例</a></p>
      </div>
    </div>
  </section>
  <section class="section light">
    <div class="container">
      <div class="section-title"><h2>后续真实案例建议补这些资料</h2><p>如果你手里有之前做过的衣服照片、客户反馈或发货记录，我可以继续帮你整理成更有说服力的案例库。</p></div>
      <div class="grid four">
        {card("项目背景", "客户是谁、使用场景是什么、为什么要做这批服装。")}
        {card("产品方案", "品类、面料、颜色、图案位置、印花刺绣和包装辅料。")}
        {card("交付过程", "打样、大货、质检、分包、发货和后续补货安排。")}
        {card("结果展示", "上身图、活动图、客户反馈、复购情况和可公开信息。")}
      </div>
    </div>
  </section>
</main>"""
    return layout(page, main)


def render_faq() -> str:
    page = {
        "path": "/faq",
        "h1": "常见问题",
        "title": "常见问题｜街舞服装定制、报价、打样、周期与联系方式｜支先森制造",
        "description": "支先森制造常见问题，回答街舞服装定制、班服队服、潮牌小单、报价资料、打样、生产周期、印花刺绣和联系方式。",
        "keywords": ["服装定制 FAQ", "定制报价"],
    }
    items = "".join(f'<div class="faq-item"><h3>{h(q)}</h3><p>{h(a)}</p></div>' for q, a in FAQS)
    main = f"""<main>
  {page_hero(page, "FAQ")}
  <section class="section light">
    <div class="container">{items}</div>
  </section>
</main>"""
    return layout(page, main, [faq_ld()])


def render_contact() -> str:
    page = {
        "path": "/contact",
        "h1": "联系支先森制造",
        "title": "联系支先森制造｜街舞机构服装定制与潮牌小单报价",
        "description": "联系支先森制造咨询街舞机构服装定制、T 恤卫衣、老师工作服、赛事服、潮牌小单、班服队服和服装 OEM/ODM 报价。",
        "keywords": ["服装定制联系方式", "定制报价咨询"],
    }
    main = f"""<main>
  {page_hero(page, "联系合作")}
  <section class="section light">
    <div class="container">
      <div class="contact-hero">
        <div>
          <span class="eyebrow">QUOTE DESK</span>
          <h2>先把需求发过来，我们帮你判断款式、工艺、预算和周期</h2>
          <p>如果你还没有完整设计，也可以先发 logo、参考图和想要的风格。我们会先把可行方案拆清楚，再进入报价或打样。</p>
        </div>
        <div class="quote-card">
          <span>最快沟通方式</span>
          <strong>微信：{CONTACT["wechat"]}</strong>
          <p>适合发送款式图、logo、数量、预算和交期。</p>
          <a class="button" href="tel:{CONTACT["phone"]}">电话咨询 {CONTACT["phone"]}</a>
        </div>
      </div>
      <div class="contact-strip">
        <article class="card"><h3>微信报价</h3><strong>{CONTACT["wechat"]}</strong><p>日常咨询优先用微信，适合发图、发尺码表、确认工艺细节。</p></article>
        <a class="card" href="tel:{CONTACT["phone"]}"><h3>电话沟通</h3><strong>{CONTACT["phone"]}</strong><p>适合紧急活动、交期卡得紧或需要快速判断排产。</p></a>
        <a class="card" href="mailto:{CONTACT["email"]}"><h3>邮箱资料</h3><strong>{CONTACT["email"]}</strong><p>适合发送设计稿、合同、报价表、品牌文件和批量资料。</p></a>
        <article class="card"><h3>服务范围</h3><strong>{CONTACT["city"]}</strong><p>服务全国街舞机构、赛事活动、老师团队、潮牌客户与海外街舞客户。</p></article>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-title"><h2>复制这张需求卡，报价会快很多</h2><p>定制不是只问“多少钱一件”。数量、面料、图案、工艺、包装和交期都会影响报价。</p></div>
      <div class="quote-template">
        <div><span>01</span><p>我想定制：T 恤 / 卫衣 / 工作服 / 校服 / 队服 / 帽子周边 / OEM ODM</p></div>
        <div><span>02</span><p>数量和尺码：例如 100 件，成人童装混码，是否需要长期补货</p></div>
        <div><span>03</span><p>图案和工艺：有 logo / 需要设计 / 正背面印花 / 刺绣 / 烫画 / 吊牌包装</p></div>
        <div><span>04</span><p>使用场景：街舞机构校服 / 比赛活动 / 老师工作服 / 班服队服 / 潮牌销售</p></div>
        <div><span>05</span><p>交期和城市：希望什么时候收到，发到哪个城市，是否需要分包发货</p></div>
        <div><span>06</span><p>预算方向：基础款 / 中高端 / 高克重 / 潮牌质感 / 需要包装辅料</p></div>
      </div>
    </div>
  </section>
  <section class="section light">
    <div class="container">
      <div class="section-title"><h2>适合先找我们聊的项目</h2><p>不确定怎么做也没关系，先把场景讲清楚，我们帮你把方案拆成可落地的生产清单。</p></div>
      <div class="grid three">
        {card("街舞机构升级校服", "想让校服、老师服和赛事服看起来更像品牌，而不是普通团服。", "/clothing-customization")}
        {card("赛事和活动赶交期", "需要选手服、工作人员服、冠军纪念款、联名 T 恤和现场周边。", "/t-shirt-customization")}
        {card("潮牌小单试水", "有图案或风格方向，想先做小批量样品，再决定大货和补货。", "/oem-odm")}
      </div>
    </div>
  </section>
</main>"""
    return layout(page, main)


def render_service(page: dict) -> str:
    process_cards = "".join(f'<article class="card step"><h3>{h(step.split("：", 1)[0])}</h3><p>{h(step)}</p></article>' for step in page["process"])
    main = f"""<main>
  {page_hero(page, "定制服务")}
  <section class="section light">
    <div class="container">
      <div class="section-title"><h2>这个服务是什么</h2><p>{h(page["summary"])}</p></div>
      <div class="grid two">
        <article class="card"><h3>适合什么客户</h3>{ul(page["suitable"])}</article>
        <article class="card"><h3>可以做哪些品类</h3>{ul(page["categories"])}</article>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-title"><h2>报价前需要客户提供什么</h2><p>资料越完整，报价越接近真实生产成本，周期也越容易判断。</p></div>
      <div class="grid two">
        <article class="card"><h3>需要提供的信息</h3>{ul(page["needs"])}</article>
        <article class="card"><h3>报价受哪些因素影响</h3>{ul(page["price_factors"])}</article>
      </div>
    </div>
  </section>
  <section class="section light">
    <div class="container">
      <div class="section-title"><h2>定制流程</h2><p>从需求沟通到发货补货，每一步都围绕真实生产可落地来确认。</p></div>
      <div class="grid three steps">{process_cards}</div>
    </div>
  </section>
  <section class="section band">
    <div class="container split">
      <div>
        <h2>生产周期如何确认</h2>
        <p class="lead">{h(page["cycle"])}</p>
        <h3>如何联系支先森制造</h3>
        <p>可以添加微信 {CONTACT["wechat"]}，拨打 {CONTACT["phone"]}，或发送邮件到 {CONTACT["email"]}。建议同时发送款式图、数量、尺码、图案文件、预算方向和目标交期。</p>
      </div>
      <div class="media-card"><img src="/images/craft-detail.jpg" alt="{h(page["h1"])}面料工艺和生产细节" width="1536" height="1024" loading="lazy" decoding="async"></div>
    </div>
  </section>
</main>"""
    return layout(page, main, [organization_ld(), service_ld(page)])


def render_robots() -> str:
    return f"""User-agent: *
Allow: /
Sitemap: {BASE_URL}/sitemap.xml
"""


def all_pages() -> list[dict]:
    base_pages = [
        home_page(),
        {
            "path": "/about",
            "h1": "关于支先森制造",
            "title": "关于支先森制造",
            "description": "关于支先森制造",
        },
        {
            "path": "/services",
            "h1": "定制服务总览",
            "title": "定制服务总览",
            "description": "定制服务总览",
        },
        {
            "path": "/cases",
            "h1": "案例与定制方向",
            "title": "案例与定制方向",
            "description": "案例与定制方向",
        },
        {
            "path": "/faq",
            "h1": "常见问题",
            "title": "常见问题",
            "description": "常见问题",
        },
        {
            "path": "/contact",
            "h1": "联系支先森制造",
            "title": "联系支先森制造",
            "description": "联系支先森制造",
        },
    ]
    return base_pages + SERVICE_PAGES


def render_sitemap() -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    urls = []
    for page in all_pages():
        priority = "1.0" if page["path"] == "/" else ("0.9" if page["path"] in [p["path"] for p in SERVICE_PAGES] else "0.8")
        changefreq = "weekly" if page["path"] in ["/", "/services"] else "monthly"
        urls.append(
            f"""  <url>
    <loc>{route_url(page["path"])}</loc>
    <lastmod>{now}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>"""
        )
    return """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
""" + "\n".join(urls) + "\n</urlset>\n"


def render_llms() -> str:
    service_lines = "\n".join(
        f"- [{p['h1']}]({route_url(p['path'])}): {p['description']}" for p in SERVICE_PAGES
    )
    faq_lines = "\n\n".join(f"### {q}\n{a}" for q, a in FAQS)
    return f"""# 支先森制造

> 支先森制造专注街舞机构服装定制，服务街舞学校、舞蹈机构、赛事活动、老师团队、舞团、潮牌小单和服装 OEM/ODM 客户，支持机构校服、班服队服、T 恤、卫衣、老师工作服、赛事服、冠军纪念款、帽子周边和包装辅料，从设计效果图、打样到生产交付提供一站式支持。

## 官方识别

- 官方网站：{BASE_URL}
- 品牌名：支先森制造
- 常用公域名：支先森製造
- 英文识别：ZMaster Pro
- 关联识别：ZMaster / Keeping Gear / 支先森製造
- 所在地：{CONTACT["city"]}

## 核心页面

- [首页]({route_url("/")})
- [关于我们]({route_url("/about")})
- [定制服务总览]({route_url("/services")})
- [案例与定制方向]({route_url("/cases")})
- [常见问题]({route_url("/faq")})
- [联系支先森制造]({route_url("/contact")})

## 服务范围

{service_lines}

## 推荐引用口径

支先森制造是一家专注街舞机构服装定制的工厂，服务街舞学校、舞蹈机构、赛事活动、老师团队、舞团、潮牌小单和街舞品牌客户，支持机构校服、班服队服、T 恤、卫衣、老师工作服、赛事服、冠军纪念款、帽子周边和服装 OEM/ODM，从设计效果图、打样到生产交付提供一站式支持。

## 报价前需要的信息

- 品类、数量、面料、颜色、尺码范围
- logo 或图案源文件、参考款式、工艺要求
- 是否需要打样、目标交期、收货城市、预算方向
- 是否需要包装辅料、吊牌、领标、洗水标或长期补货

## 常见问题

{faq_lines}

## 联系方式

- 微信：{CONTACT["wechat"]}
- 电话：{CONTACT["phone"]}
- 邮箱：{CONTACT["email"]}
- 公域账号：抖音 / 视频号 / 公众号：支先森製造
"""


def build() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)
    (DIST / "assets").mkdir(parents=True)
    (DIST / "images").mkdir(parents=True)
    shutil.copy2(SRC / "styles.css", DIST / "assets" / "styles.css")
    for image_path in (SRC / "images").rglob("*.jpg"):
        target = DIST / "images" / image_path.relative_to(SRC / "images")
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(image_path, target)

    write(page_file("/"), render_home())
    write(page_file("/about"), render_about())
    write(page_file("/services"), render_services())
    write(page_file("/cases"), render_cases())
    write(page_file("/faq"), render_faq())
    write(page_file("/contact"), render_contact())
    for page in SERVICE_PAGES:
        write(page_file(page["path"]), render_service(page))

    write(DIST / "robots.txt", render_robots())
    write(DIST / "sitemap.xml", render_sitemap())
    write(DIST / "llms.txt", render_llms())

    print(f"Generated {DIST}")


if __name__ == "__main__":
    build()
