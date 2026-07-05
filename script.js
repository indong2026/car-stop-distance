const speed = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const distance = document.getElementById("distance");
const acc = document.getElementById("acc");

const myCar = document.getElementById("myCar");
const enemyCar = document.getElementById("enemyCar");
const brakeZone = document.getElementById("brakeZone");
const result = document.getElementById("result");

const weather = document.getElementById("weather");

let interval;

calculate();

const road = document.getElementById("road");

speed.addEventListener("input", () => {
  speedValue.textContent = speed.value + " km/h";
  calculate();
});

distance.addEventListener("input", calculate);

acc.addEventListener("input", calculate);

weather.addEventListener("change", () => {
  acc.value = weather.value;

  if (weather.value == 8) {
    road.style.background = "#555";
  } else if (weather.value == 5) {
    road.style.background = "#6c7a89";
  } else {
    road.style.background = "#cfd8dc";
  }

  calculate();
});

document.getElementById("checkBtn").addEventListener("click", calculate);

document.getElementById("startBtn").addEventListener("click", startSimulation);

function calculate() {
  const v = Number(speed.value) / 3.6;
  const d = Number(distance.value);
  const a = Number(acc.value);

  if (d <= 0 || a <= 0) {
    result.textContent = "값을 입력하세요.";
    return;
  }

  const s = v ** 2 / (2 * a);
  const safeDistance = s + 8;

  result.innerHTML = `제동거리 : ${s.toFixed(1)}m<br>
   현재 날씨 : ${weather.options[weather.selectedIndex].text}`;

  // 빨간 차는 고정
  enemyCar.style.left = "50px";

  // 파란 차 위치
  const carStart = 50 + d * 10;

  if (!interval) {
    myCar.style.left = carStart + "px";
  }

  brakeZone.style.left = carStart - s * 10 + "px";

  brakeZone.style.width = safeDistance * 10 + "px";

  if (d <= safeDistance) {
    brakeZone.style.background = "red";
    result.textContent += " 🚨 충돌 위험";
  } else {
    brakeZone.style.background = "dodgerblue";
    result.textContent += " ✅ 안전";
  }
}

function startSimulation() {
  calculate();
  clearInterval(interval);
  interval = null;

  

  let carX = 50 + Number(distance.value) * 10;
  myCar.style.left = carX + "px";

  

  let currentSpeed = Number(speed.value) / 3.6;

  const deceleration = Number(acc.value);

  const enemyX = 50;

  interval = setInterval(() => {
    if (currentSpeed < 0) {
      currentSpeed = 0;
      
    }

    carX -= currentSpeed;

    myCar.style.left = carX + "px";

    const brakeDistance = currentSpeed ** 2 / (2 * deceleration);

    brakeZone.style.left = carX - brakeDistance * 10 + "px";

    brakeZone.style.width = brakeDistance * 10 + "px";

    const remain = (carX - enemyX) / 10;

    const safetyMargin = 8;

    if (remain <= brakeDistance + safetyMargin) {
      currentSpeed -= deceleration * 0.1;

      brakeZone.style.background = "red";

      result.textContent = "🚨 자동 제동 중";
    } else {
      result.textContent = `🚗 주행 중 (${currentSpeed.toFixed(1)} m/s)`;
    }

    if (currentSpeed <= 0) {
      clearInterval(interval);
      interval = null;

      result.textContent = "🛑 차량 정지";
    }
  }, 100);
}