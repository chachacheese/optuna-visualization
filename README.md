# Optuna Visualization

Optuna 하이퍼파라미터 최적화 **실행 흐름을 시각적으로 설명하는 React 컴포넌트**입니다.  
GridSearchCV와 Optuna의 탐색 방식 차이를 직관적으로 이해하기 위해 제작되었습니다.

---

## 📌 프로젝트 개요

머신러닝 모델 튜닝 과정에서 Optuna는 강력한 도구이지만,  
`Study → Trial → Suggest → Evaluate` 흐름이 처음에는 직관적으로 와닿지 않을 수 있습니다.

이 프로젝트는 Optuna의 내부 동작 과정을 **단계별 카드 UI**로 시각화하여  
하이퍼파라미터 최적화 흐름을 쉽게 이해할 수 있도록 돕는 것을 목표로 합니다.

---

## 🎯 이 컴포넌트로 설명하는 내용

- Optuna 실행 흐름
  - Study 생성
  - Trial 반복 구조
  - Sampler(TPE)의 파라미터 제안
  - 모델 학습 및 평가
  - 결과 기록 및 최적 파라미터 선택
- Pruning(조기 중단) 개념
- GridSearchCV vs Optuna 탐색 방식 비교

---

## 📸 미리보기

![preview](https://github.com/user-attachments/assets/eb3b1a59-247f-42fc-9423-760cf3d59fa9)

---
⚙️ 설치 및 실행
```
git clone https://github.com/chachacheese/optuna-visualization.git
cd optuna-visualization
npm install
npm start
```
---
🧩 주요 파일 구조

```
optuna-visualization/
├── README.md
├── OptunaFlow.jsx        # Optuna 실행 흐름 시각화 컴포넌트
└── preview.png           # 데모 이미지


```

🔗 Velog: 👉 Optuna 하이퍼파라미터 최적화 – GridSearch 말고 이거 써봐
https://velog.io/@jiiiin0/Optuna-%ED%95%98%EC%9D%B4%ED%8D%BC%ED%8C%8C%EB%9D%BC%EB%AF%B8%ED%84%B0-%EC%B5%9C%EC%A0%81%ED%99%94-GridSearch-%EB%A7%90%EA%B3%A0-%EC%9D%B4%EA%B1%B0-%EC%8D%A8%EB%B4%90

