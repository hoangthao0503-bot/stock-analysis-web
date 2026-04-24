
import os
import json
import random
from datetime import datetime, timedelta

def generate_mock_sentiment(symbol):
    sources = ["SSI Research", "VNDirect", "CafeF", "Vietstock", "Tin nhanh chứng khoán"]
    positive_titles = [
        f"Trien vong tang truong cua {symbol} kha quan trong quy toi",
        f"{symbol} cong bo ket qua kinh doanh vuot ky vong",
        f"Khoi ngoai tiep tuc mua rong manh ma {symbol}",
        f"Phan tich ky thuat: {symbol} xuat hien tin hieu mua manh",
        f"{symbol} mo rong quy mo san xuat, ky vong but pha"
    ]
    negative_titles = [
        f"Ap luc chot loi gia tang tai ma {symbol}",
        f"{symbol} doi mat voi thach thuc tu chi phi dau vao tang",
        f"Canh bao vung qua mua doi voi co phieu {symbol}",
        f"Khoi ngoai quay dau ban rong {symbol}",
        f"Bien dong gia {symbol} trong bien do hep, thanh khoan thap"
    ]
    
    sentiment_data = []
    for i in range(3):
        sentiment = random.choice(['positive', 'negative', 'neutral'])
        if sentiment == 'positive':
            title = random.choice(positive_titles)
        elif sentiment == 'negative':
            title = random.choice(negative_titles)
        else:
            title = f"Cap nhat dien bien giao dich ma {symbol} phien hom nay"
            
        sentiment_data.append({
            "title": title,
            "source": random.choice(sources),
            "date": (datetime.now() - timedelta(days=i)).strftime("%d/%m/%Y"),
            "sentiment": sentiment,
            "link": "https://ssi.com.vn"
        })
    return sentiment_data

def generate_risk_metrics(symbol):
    # Simulated risk metrics
    beta = random.uniform(0.7, 1.5)
    volatility = random.uniform(0.15, 0.35)
    sharpe = random.uniform(0.3, 1.2)
    var_95 = -random.uniform(0.015, 0.035)
    avg_return = random.uniform(0.05, 0.25)
    
    return {
        "symbol": symbol,
        "beta": beta,
        "volatility": volatility,
        "sharpe_ratio": sharpe,
        "var_95": var_95,
        "avg_return": avg_return
    }

def generate_backtest_data(symbol):
    # Generate 180 days of simulation data
    dates = [(datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(180)]
    dates.reverse()
    
    stock_perf = 0
    vni_perf = 0
    data = []
    
    for date in dates:
        vni_move = random.gauss(0.05, 0.8) # VNI daily move %
        stock_move = vni_move * random.uniform(0.8, 1.3) + random.gauss(0.02, 0.5)
        
        stock_perf += stock_move
        vni_perf += vni_move
        
        data.append({
            "date": date,
            "stock": round(stock_perf, 2),
            "vnindex": round(vni_perf, 2)
        })
    return data

def main():
    # Use VN30 tickers as primary targets
    tickers = [
        'ACB','BCM','BID','BVH','CTG','FPT','GAS','GVR','HDB','HPG',
        'MBB','MSN','MWG','PLX','PNJ','POW','SAB','SHB','SSB','SSI',
        'STB','TCB','TPB','VCB','VHM','VIB','VIC','VJC','VNM','VPB'
    ]
    
    data_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")
    os.makedirs(os.path.join(data_dir, "risk"), exist_ok=True)
    os.makedirs(os.path.join(data_dir, "sentiment"), exist_ok=True)
    os.makedirs(os.path.join(data_dir, "backtest"), exist_ok=True)
    
    print(f"Starting to generate analysis data for {len(tickers)} symbols...")
    
    for sym in tickers:
        print(f"-> Processing: {sym}")
        
        # Risk
        risk_path = os.path.join(data_dir, "risk", f"{sym}_risk.json")
        with open(risk_path, "w", encoding="utf-8") as f:
            json.dump(generate_risk_metrics(sym), f, indent=2)
            
        # Sentiment
        sent_path = os.path.join(data_dir, "sentiment", f"{sym}_sentiment.json")
        with open(sent_path, "w", encoding="utf-8") as f:
            json.dump(generate_mock_sentiment(sym), f, ensure_ascii=False, indent=2)
            
        # Backtest
        bt_path = os.path.join(data_dir, "backtest", f"{sym}_backtest.json")
        with open(bt_path, "w", encoding="utf-8") as f:
            json.dump(generate_backtest_data(sym), f, indent=2)
            
    print("Success! Analysis data updated.")

if __name__ == "__main__":
    main()
