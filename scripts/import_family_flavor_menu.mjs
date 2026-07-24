#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const input =
  process.argv[2] ||
  path.resolve(root, "../亲子/月亮家手机点菜/app/menu-data.ts");
const output =
  process.argv[3] ||
  path.resolve(root, "content/family-flavor-menu.json");

const source = fs.readFileSync(input, "utf8");

function expression(pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error(`无法读取 ${label}`);
  return Function(`"use strict"; return (${match[1]});`)();
}

const names = expression(/const names = (\[[\s\S]*?\n\]);/, "菜品名称");
const categoryRanges = expression(
  /const categoryRanges = (\[[\s\S]*?\n\]) as const;/,
  "分类范围",
);
const categoryOverrides = new Map(
  expression(
    /const categoryOverrides = new Map<number, string>\((\[[\s\S]*?\n\])\);/,
    "分类调整",
  ),
);
const audienceOverrides = new Map(
  expression(
    /const audienceOverrides = new Map<number, Audience>\((\[[\s\S]*?\n\])\);/,
    "人群调整",
  ),
);
const cuisineOverrides = new Map(
  expression(
    /const cuisineOverrides = new Map<number, Cuisine>\((\[[\s\S]*?\n\])\);/,
    "菜系调整",
  ),
);

function numberSet(name) {
  const pattern = new RegExp(`const ${name} = new Set\\((\\[[\\s\\S]*?\\])\\);`);
  return new Set(expression(pattern, name));
}

const childIds = numberSet("childIds");
const adultIds = numberSet("adultIds");
const occasionalIds = numberSet("occasionalIds");
const weekendIds = numberSet("weekendIds");

function categoryFor(id) {
  return (
    categoryOverrides.get(id) ||
    categoryRanges.find(([, start, end]) => id >= start && id <= end)?.[0] ||
    "其他"
  );
}

function audienceFor(id) {
  if (audienceOverrides.has(id)) return audienceOverrides.get(id);
  if (childIds.has(id)) return "亲子";
  if (adultIds.has(id)) return "成人";
  if (occasionalIds.has(id)) return "偶尔";
  if (weekendIds.has(id)) return "周末";
  return "全家";
}

const exactRecipes = {
  3: {
    duration: "45分钟",
    difficulty: "进阶",
    ingredients: ["鲜米线 400克", "鸡汤或骨汤 1锅", "鸡胸、里脊、鱼片适量", "豆皮、韭菜、鹌鹑蛋适量"],
    steps: ["高汤提前熬香并保持滚烫。", "肉类切薄片，蔬菜洗净切细，米线烫熟。", "先把生肉片放入滚汤，再依次下豆皮、蔬菜和米线。", "按家人口味加入盐、胡椒和少量葱花。"],
    tip: "汤必须足够滚烫，薄肉片才能在上桌后迅速烫熟。",
  },
  27: {
    duration: "70分钟",
    difficulty: "家常",
    ingredients: ["土鸡 半只", "姜片 4片", "香菇或菌菇适量", "盐、白胡椒少量"],
    steps: ["鸡肉斩块，冷水浸泡后吸干水分。", "鸡块和姜片放入汽锅，菌菇铺在上层。", "汽锅坐在烧水锅上，以蒸汽慢蒸约1小时。", "起锅前再加盐和白胡椒调味。"],
    tip: "不额外加水，靠蒸汽凝结成汤，鸡味更集中。",
  },
  31: {
    duration: "35分钟",
    difficulty: "家常",
    ingredients: ["鲜鱼 1条", "贵州红酸汤 250克", "番茄 2个", "木姜子油、姜蒜、香菜适量"],
    steps: ["鱼处理干净切块，用少量盐和料酒腌10分钟。", "锅中炒香姜蒜和番茄，加入红酸汤与清水煮开。", "先下鱼骨煮出鲜味，再放鱼片小火煮熟。", "出锅前点少量木姜子油，撒香菜。"],
    tip: "红酸汤先炒再煮更香；孩子吃可减少酸辣料，单独留清汤鱼片。",
  },
  34: {
    duration: "35分钟",
    difficulty: "进阶",
    ingredients: ["米皮 20张", "豆芽、黄瓜、胡萝卜适量", "脆哨或肉末适量", "酸汤蘸水 1碗"],
    steps: ["蔬菜分别切细丝，能生吃的洗净沥干。", "豆芽等需要熟制的配菜快速焯水。", "米皮摊开，放入多种配菜与少量脆哨。", "包成小卷，蘸酸汤食用。"],
    tip: "配菜颜色越丰富越吸引孩子，蘸水与脆哨分开放。",
  },
  38: {
    duration: "80分钟",
    difficulty: "进阶",
    ingredients: ["鸭子 半只", "麦芽糖或红糖适量", "卤料 1份", "熟芝麻适量"],
    steps: ["鸭肉焯水后放入卤汤，小火卤至熟透。", "捞出晾干表皮，刷薄薄一层糖浆。", "低温炸至表皮酥脆并呈琥珀色。", "斩块装盘，撒熟芝麻。"],
    tip: "卤好后一定晾干再炸，颜色更亮，表皮也更脆。",
  },
  47: {
    duration: "30分钟",
    difficulty: "家常",
    ingredients: ["鲜虾 200克", "鱿鱼、蛤蜊适量", "冬阴功酱 2大勺", "香茅、南姜、柠檬叶、椰浆适量"],
    steps: ["海鲜处理干净，蛤蜊提前吐沙。", "水中放香茅、南姜和柠檬叶煮出香味。", "加入冬阴功酱、番茄和菌菇煮开。", "放海鲜煮熟，关火后加椰浆和柠檬汁。"],
    tip: "柠檬汁关火后再加，酸香更清爽。",
  },
  51: {
    duration: "25分钟",
    difficulty: "家常",
    ingredients: ["鲈鱼 1条", "青柠 2个", "鱼露 1勺", "蒜末、小米椒、香菜适量"],
    steps: ["鲈鱼处理干净，两面划刀并铺姜片。", "水开后上锅蒸8至10分钟。", "青柠汁、鱼露、糖、蒜末和小米椒调成料汁。", "倒掉蒸鱼水，淋汁后撒香菜。"],
    tip: "儿童版先留原味鱼肉，再给大人淋酸辣汁。",
  },
  63: {
    duration: "25分钟",
    difficulty: "家常",
    ingredients: ["鲜虾 300克", "泰式黄咖喱 2大勺", "椰浆 200毫升", "洋葱、彩椒适量"],
    steps: ["鲜虾开背去虾线，洋葱和彩椒切块。", "少油煎虾至变色后先盛出。", "炒香洋葱与咖喱酱，倒入椰浆煮匀。", "虾和彩椒回锅，小火收至酱汁浓稠。"],
    tip: "虾先煎后回锅，肉质更弹；椰浆不要大火久煮。",
  },
  94: {
    duration: "20分钟",
    difficulty: "快手",
    ingredients: ["猪肉末 250克", "罗勒或九层塔 1把", "蒜末、小米椒适量", "鱼露、生抽、蚝油少量"],
    steps: ["肉末拨散，九层塔洗净取叶。", "热锅少油炒香蒜末和小米椒。", "放肉末大火炒散，加鱼露、生抽和少量糖。", "关火前下九层塔翻匀，配米饭和煎蛋。"],
    tip: "九层塔最后放，香气最明显；儿童版先盛出不辣肉末。",
  },
  95: {
    duration: "30分钟",
    difficulty: "家常",
    ingredients: ["牛肉片 250克", "米饭 4碗", "菠菜、胡萝卜、豆芽适量", "韩式拌饭酱、鸡蛋适量"],
    steps: ["牛肉用生抽、梨汁和芝麻油腌15分钟。", "蔬菜分别焯熟或炒熟，保持颜色清爽。", "牛肉大火快炒，鸡蛋煎成半熟。", "米饭铺碗，码入蔬菜、牛肉和鸡蛋，按口味拌酱。"],
    tip: "孩子可用海苔碎和少量芝麻油代替辣酱。",
  },
  98: {
    duration: "25分钟",
    difficulty: "快手",
    ingredients: ["嫩豆腐 1盒", "泡菜 150克", "五花肉片或蛤蜊适量", "鸡蛋 1个"],
    steps: ["锅中炒香五花肉片和泡菜。", "加入高汤煮开，再放洋葱和菌菇。", "嫩豆腐用勺分块下锅，小火煮8分钟。", "打入鸡蛋，撒葱花后关火。"],
    tip: "泡菜本身有咸味，最后试味再补盐。",
  },
  104: {
    duration: "25分钟",
    difficulty: "快手",
    ingredients: ["虾仁、鱿鱼共200克", "香葱 1把", "鸡蛋 1个", "面粉与淀粉适量"],
    steps: ["海鲜切小粒，香葱切成长段。", "面粉、淀粉、鸡蛋和水调成能流动的面糊。", "平底锅少油，先铺香葱和海鲜，再淋面糊。", "两面煎至金黄，切块配蘸汁。"],
    tip: "面糊不要太厚，边缘煎脆才有层次。",
  },
  106: {
    duration: "30分钟",
    difficulty: "家常",
    ingredients: ["去骨鸡腿 2只", "生抽 2勺", "味醂或米酒 2勺", "蜂蜜或糖 1勺"],
    steps: ["鸡腿肉吸干水分，皮面轻划两刀。", "皮朝下入锅，中小火煎出油脂并煎脆。", "翻面煎熟，倒入照烧汁小火收浓。", "静置2分钟后切块，淋锅中余汁。"],
    tip: "先把鸡皮煎脆，再下汁，成品不会软塌。",
  },
  114: {
    duration: "40分钟",
    difficulty: "家常",
    ingredients: ["牛肉或鸡肉 250克", "土豆 2个", "胡萝卜 1根", "日式咖喱块适量"],
    steps: ["肉和根茎蔬菜切成大小接近的块。", "先把肉块炒香，再放洋葱、土豆和胡萝卜。", "加水炖至食材软熟，关小火放咖喱块。", "不断搅匀，煮至酱汁浓稠后配米饭。"],
    tip: "咖喱块要转小火再放，避免粘锅；苹果泥可增加柔和甜味。",
  },
  128: {
    duration: "35分钟",
    difficulty: "家常",
    ingredients: ["肥牛卷 300克", "大白菜、茼蒿适量", "豆腐、香菇、魔芋丝适量", "日式酱油、味醂、糖适量"],
    steps: ["蔬菜、豆腐和菌菇洗净切好，整齐码盘。", "锅中煎香葱段和少量肥牛。", "加入寿喜烧汁，再依次放耐煮食材。", "边煮边吃，叶菜与肥牛少量多次下锅。"],
    tip: "酱汁偏甜咸，儿童份可兑高汤稀释。",
  },
  140: {
    duration: "45分钟",
    difficulty: "家常",
    ingredients: ["鸡腿 2只", "花生碎、芝麻适量", "生抽、香醋、红油、蒜末适量", "葱姜适量"],
    steps: ["鸡腿冷水下锅，加葱姜小火煮熟。", "关火浸泡8分钟，再放冰水中降温。", "生抽、香醋、糖、蒜末和红油调成料汁。", "鸡腿斩块，淋汁并撒花生碎和芝麻。"],
    tip: "鸡腿煮熟后浸泡再冰镇，肉嫩皮弹；孩子份不淋红油。",
  },
  151: {
    duration: "80分钟",
    difficulty: "家常",
    ingredients: ["羊肉 600克", "白萝卜 1根", "姜片、葱段适量", "白胡椒、香菜少量"],
    steps: ["羊肉冷水浸泡后焯水，洗去浮沫。", "羊肉加足量热水、姜片和葱段，小火炖50分钟。", "放白萝卜块继续炖20分钟。", "最后加盐和白胡椒，撒香菜。"],
    tip: "盐最后放，汤更鲜；怕膻可加几粒白胡椒，不建议重香料盖味。",
  },
};

function cookingStyle(name, category) {
  if (/凉拌|口水|柠檬凤爪|蒜泥白肉|丝娃娃/.test(name)) return "凉拌";
  if (/蒸|粉蒸|汽锅/.test(name)) return "蒸";
  if (/汤|羹|瓦罐|煲|炖/.test(name) || /汤羹/.test(category)) return "炖煮";
  if (/炸|锅包|虾球|小酥肉|油条/.test(name)) return "煎炸";
  if (/烧|焖|扣|可乐|糖醋|话梅/.test(name)) return "焖烧";
  if (/粥/.test(name)) return "煮粥";
  if (/饭|面|馄饨|馒头|窝窝头/.test(name) || /主食/.test(category)) return "主食";
  return "快炒";
}

function mainIngredient(name, category) {
  const keys = [
    "牛腩", "牛肉", "羊肉", "排骨", "五花肉", "里脊", "肉丝", "猪肉",
    "鸡翅", "鸡腿", "鸡肉", "鸡", "老鸭", "鸭", "鲈鱼", "带鱼", "鱼",
    "鲜虾", "虾仁", "虾", "鱿鱼", "生蚝", "花甲", "豆腐", "鸡蛋",
    "莲藕", "藕", "土豆", "山药", "南瓜", "白萝卜", "萝卜", "白菜",
    "茄子", "花菜", "菌菇", "米饭", "米线", "面",
  ];
  return keys.find((key) => name.includes(key)) || category.replace(/与|类|菌菇|薯类/g, "");
}

function genericRecipe(name, category, audience) {
  const ingredient = mainIngredient(name, category);
  const style = cookingStyle(name, category);
  const common = {
    快炒: {
      duration: "20分钟",
      difficulty: "快手",
      ingredients: [`${ingredient} 300克`, "当季配菜适量", "葱姜蒜适量", "生抽、盐、淀粉少量"],
      steps: ["主料切成适合入口的大小，肉类提前薄薄上浆。", "配菜洗净切好，调味料提前兑成小碗汁。", "热锅少油，先炒香主料，再放配菜大火翻炒。", "沿锅边淋入料汁，快速收汁后立即出锅。"],
      tip: "所有食材先备齐再开火，快炒口感更嫩。",
    },
    蒸: {
      duration: "30分钟",
      difficulty: "家常",
      ingredients: [`${ingredient} 适量`, "葱姜适量", "生抽或蒸鱼豉油少量", "食用油少量"],
      steps: ["主料处理干净并沥干，按需要腌制10分钟。", "码入浅盘，铺姜片或合适配菜。", "水开后上锅，根据厚度蒸至刚熟。", "倒掉多余水分，撒葱花并淋少量热油。"],
      tip: "蒸制时间从水开后计算，避免久蒸变老。",
    },
    炖煮: {
      duration: "60分钟",
      difficulty: "家常",
      ingredients: [`${ingredient} 500克`, "根茎或菌菇配菜适量", "姜片、葱段适量", "盐、白胡椒少量"],
      steps: ["肉类冷水焯去浮沫，蔬菜洗净切块。", "主料加足量热水和葱姜，大火煮开。", "转小火慢炖，按熟成速度加入配菜。", "食材软熟后再加盐，静置片刻后上桌。"],
      tip: "盐最后放，汤味更清甜，肉也更容易炖软。",
    },
    煎炸: {
      duration: "35分钟",
      difficulty: "进阶",
      ingredients: [`${ingredient} 300克`, "鸡蛋或面糊适量", "淀粉适量", "椒盐或蘸料适量"],
      steps: ["主料切匀并调味腌制，表面吸干水分。", "按菜品需要裹蛋液、淀粉或薄面糊。", "油温约六成热时分批下锅，炸至定型。", "升高油温复炸片刻，沥油后调味。"],
      tip: "分批下锅能稳定油温；儿童食用注意放凉和控制油量。",
    },
    焖烧: {
      duration: "45分钟",
      difficulty: "家常",
      ingredients: [`${ingredient} 500克`, "葱姜蒜适量", "生抽、老抽、糖少量", "清水或高汤适量"],
      steps: ["主料处理干净，肉类先焯水或煎香表面。", "锅中炒香葱姜蒜和基础酱料。", "放回主料，加热水没过大半，小火焖熟。", "开大火收汁，试味后装盘。"],
      tip: "先煎香再焖更有层次，收汁时要勤翻动。",
    },
    凉拌: {
      duration: "20分钟",
      difficulty: "快手",
      ingredients: [`${ingredient} 适量`, "蒜末、香菜适量", "生抽、香醋少量", "芝麻油或红油少量"],
      steps: ["主料按需要煮熟、焯水或切丝。", "迅速过凉并充分沥干，保持爽脆。", "生抽、香醋、蒜末和少量糖调成料汁。", "食用前再拌匀，撒芝麻或香菜。"],
      tip: "充分沥水再拌，味道不会被稀释。",
    },
    煮粥: {
      duration: "45分钟",
      difficulty: "家常",
      ingredients: ["大米或杂粮 150克", `${ingredient} 适量`, "清水 适量", "盐或糖少量"],
      steps: ["米淘洗后浸泡20分钟。", "加足量清水，大火煮开后转小火。", "不时搅动，煮至米粒开花。", "加入配料煮熟，最后再调味。"],
      tip: "浸泡后更容易煮出绵稠口感。",
    },
    主食: {
      duration: "30分钟",
      difficulty: "家常",
      ingredients: [`${ingredient} 适量`, "蛋白质配料适量", "蔬菜配料适量", "基础调味料少量"],
      steps: ["提前准备主食，并把肉蛋蔬菜切成均匀小块。", "先处理需要更长时间熟成的配料。", "加入主食翻炒、拌匀或煮至入味。", "最后补充蔬菜和调味，趁热食用。"],
      tip: "主食、蛋白质和蔬菜一起搭配，更适合家庭一餐。",
    },
  };
  const recipe = common[style];
  if (audience === "亲子") {
    recipe.tip += " 给孩子的一份先盛出，再补辣椒或重口调味。";
  }
  return recipe;
}

const featuredIds = new Set([31, 63, 128, 140, 151]);
const dishes = names.map((name, index) => {
  const id = index + 1;
  const category = categoryFor(id);
  const audience = audienceFor(id);
  const cuisine = cuisineOverrides.get(id) || "";
  const recipe = exactRecipes[id] || genericRecipe(name, category, audience);
  return {
    id,
    name,
    category,
    audience,
    cuisine,
    seasonal: false,
    featured: featuredIds.has(id),
    image: `./dishes/${String(id).padStart(3, "0")}.jpg`,
    summary: `${cuisine ? `${cuisine}风味，` : ""}${audience === "亲子" ? "口味可以为孩子单独调整，" : ""}${recipe.duration}完成的${category}家庭做法。`,
    ...recipe,
  };
});

dishes.push({
  id: 151,
  name: "白萝卜羊肉汤",
  category: "冬季温补",
  audience: "全家",
  cuisine: "",
  seasonal: true,
  featured: true,
  image: "./dishes/151.jpg",
  summary: "冬季温补家庭汤，白萝卜清甜，适合一家人围桌分享。",
  ...exactRecipes[151],
});

const result = {
  brand: {
    name: "FAMILY FLAVOR",
    chineseName: "家味点菜",
    owner: "支先森制造 · ZMASTER",
    slogan: "一起选，一起吃，一起记住家的味道",
  },
  version: new Date().toISOString(),
  refreshSeconds: 60,
  maxSelections: 6,
  categoryOrder: [
    "全部",
    ...categoryRanges.map(([name]) => name),
    "冬季温补",
  ],
  cuisineOrder: ["全部风味", "云贵川渝", "泰式", "韩式", "日式"],
  featuredIds: [31, 63, 128, 140, 151],
  dishes,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(`已生成 ${output}，共 ${dishes.length} 道菜`);
