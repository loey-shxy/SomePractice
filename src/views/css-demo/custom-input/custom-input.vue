<template>
  <div class="custom-input">
    <div class="input-box">
      <input type="text" required />
      <span>User Name</span>
      <i></i>
    </div>
    <div class="input-box">
      <input type="text" required />
      <span>Password</span>
      <i></i>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
<style lang="scss" scoped>
  .custom-input {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    flex-direction: column;

    .input-box {
      position: relative;
      width: 350px;
      margin-bottom: 36px;
      &:last-child {
        margin-bottom: 0;
      }
      input {
        position: relative;
        padding: 8px 10px;
        width: 100%;
        border: none;
        outline: none;
        background-color: transparent;
        color: #fff;
        font-size: 1.25em;
        letter-spacing: 0.05em;
        z-index: 2;
        &:focus ~ span,
        &:valid ~ span {
          font-size: 0.85em;
          transform: translateY(-32px);
        }
        &:valid ~ i,
        &:focus ~ i {
          height: 100%;
          box-shadow: inset0 0 10px rgba(0, 0, 0, .25);
        }
      }
      span {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 10px 0;
        pointer-events: none;
        font-size: 1em;
        transition: .5s;
        color: #333;
        letter-spacing: .05em;
      }
      i {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(45deg, #2196f3, #ff4685);
        transition: .5s;
        z-index: 1;
        border-radius: 4px;
        pointer-events: none;
      }
    }
  }
</style>