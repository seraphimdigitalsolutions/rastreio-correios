// Correios - Rastreamento de Objetos
const API_BASE = (window.TRACKING_API_URL || '').replace(/\/$/, '');
const API = `${API_BASE}/api/tracking`;
const ORIGIN = 'Cajamar/SP';

// Official Correios SVG Icons (Base64 data URIs)
const ICONS = {
  // Checkmark / Delivered
  check: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQyIDI5Ljc4NTRWMTYuMjM2MUM0MiAxNS40Nzg1IDQxLjU3MiAxNC43ODYgNDAuODk0NCAxNC40NDcyTDI0Ljg5NDQgNi40NDcyMUMyNC4zMzE0IDYuMTY1NjkgMjMuNjY4NiA2LjE2NTY5IDIzLjEwNTYgNi40NDcyMUw3LjEwNTU3IDE0LjQ0NzJDNi40MjggMTQuNzg2IDYgMTUuNDc4NSA2IDE2LjIzNjFWMzEuNzYzOUM2IDMyLjUyMTUgNi40MjggMzMuMjE0IDcuMTA1NTcgMzMuNTUyOEwyMy4xMTU4IDQxLjU1NzlDMjMuNjczMSA0MS44MzY1IDI0LjMyODQgNDEuODM5NSAyNC44ODgyIDQxLjU2NkwyOS44NTI4IDM5LjE0MDIiIHN0cm9rZT0iIzNGM0UzQiIvPgo8cGF0aCBkPSJNMjQgNDJWMjQuNDVNMjQgMjQuNDVMNiAxNU0yNCAyNC40NUw0MiAxNSIgc3Ryb2tlPSIjM0YzRTNCIi8+CjxwYXRoIGQ9Ik0xMyAxMS43MjczTDMwLjY5MjMgMjAuODE4MlYyNy4zNjE5QzMwLjY5MjMgMjguMTEwMSAzMS40ODM5IDI4LjU5MzMgMzIuMTQ5MyAyOC4yNTEzTDM0LjkxNDEgMjYuODMwN0MzNS41ODA4IDI2LjQ4ODEgMzYgMjUuODAxNCAzNiAyNS4wNTE4VjE4LjA5MDlMMTguMzA3NyA5IiBzdHJva2U9IiMzRjNFM0IiLz4KPHBhdGggZD0iTTkgMzAuMzgyVjI2LjgwOUM5IDI2LjQzNzMgOS4zOTExNiAyNi4xOTU2IDkuNzIzNjEgMjYuMzYxOEwxMy40NDcyIDI4LjIyMzZDMTMuNzg2IDI4LjM5MyAxNCAyOC43MzkzIDE0IDI5LjExOFYzMi42OTFDMTQgMzMuMDYyNyAxMy42MDg4IDMzLjMwNDQgMTMuMjc2NCAzMy4xMzgyTDkuNTUyNzkgMzEuMjc2NEM5LjIxNCAzMS4xMDcgOSAzMC43NjA3IDkgMzAuMzgyWiIgc3Ryb2tlPSIjM0YzRTNCIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTMyLjcxNzcgMzcuNTg5NUwzMy4wNzEyIDM3Ljk0M0wzMy40MjQ4IDM3LjU4OTVMNDAuOTM1MiAzMC4wNzlDNDEuNTIxIDI5LjQ5MzMgNDIuNDcwNyAyOS40OTMzIDQzLjA1NjUgMzAuMDc5QzQzLjY0MjMgMzAuNjY0OCA0My42NDIzIDMxLjYxNDYgNDMuMDU2NSAzMi4yMDA0TDMzLjQyNDggNDEuODMyMUMzMy4yMjk1IDQyLjAyNzQgMzIuOTEyOSA0Mi4wMjc0IDMyLjcxNzcgNDEuODMyMUwyOC4wMzE0IDM3LjE0NTlDMjcuNDQ1NiAzNi41NjAxIDI3LjQ0NTYgMzUuNjEwNCAyOC4wMzE0IDM1LjAyNDZDMjguNjE3MiAzNC40Mzg4IDI5LjU2NjkgMzQuNDM4OCAzMC4xNTI3IDM1LjAyNDZMMzIuNzE3NyAzNy41ODk1WiIgc3Ryb2tlPSIjM0YzRTNCIi8+Cjwvc3ZnPgo=',
  // Truck / Transit
  truck: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMyLjUgMzZIMjhIMjlDMzAuMTA0NiAzNiAzMSAzNS4xMDQ2IDMxIDM0VjE2SDM4LjQxNDZDMzguODEwOCAxNiAzOS4xOTkxIDE2LjEwNjEgMzkuNTM2MiAxNi4zMDYzQzM5Ljg3MzIgMTYuNTA2NiA0MC4xNDU3IDE2Ljc5MzEgNDAuMzIyOSAxNy4xMzM4TDQzLjc3NDUgMjMuNzcxOUM0My45MjI4IDI0LjA1NjcgNDQuMDAwMSAyNC4zNzA5IDQ0IDI0LjY4OTRWMjhNMzkuNSAzNkg0MS44NjY3QzQyLjQzMjUgMzYgNDIuOTc1MSAzNS43ODM5IDQzLjM3NTIgMzUuMzk5MkM0My43NzUyIDM1LjAxNDUgNDQgMzQuNDkyOCA0NCAzMy45NDg3VjMyIiBzdHJva2U9IiMzRjNFM0IiLz4KPHBhdGggZD0iTTE1LjUgMzZIMjkuMDM2NEMyOS41NTcyIDM2IDMwLjA1NjYgMzUuNzg1NSAzMC40MjQ5IDM1LjQwMzZDMzAuNzkzMSAzNS4wMjE3IDMxIDM0LjUwMzcgMzEgMzMuOTYzNlYxMC4wMzY0QzMxIDkuNDk2MjkgMzAuNzkzMSA4Ljk3ODMzIDMwLjQyNDkgOC41OTY0NEMzMC4wNTY2IDguMjE0NTUgMjkuNTU3MiA4IDI5LjAzNjQgOEg1Ljk2MzY0QzUuNDQyODUgOCA0Ljk0MzM5IDguMjE0NTUgNC41NzUxNCA4LjU5NjQ0QzQuMjA2ODggOC45NzgzMyA0IDkuNDk2MjkgNCAxMC4wMzY0VjI4TTguNSAzNkg1Ljk2MzY0QzUuNDQyODUgMzYgNC45NDMzOSAzNS43ODU1IDQuNTc1MTQgMzUuNDAzNkM0LjIwNjg4IDM1LjAyMTcgNCAzNC41MDM3IDQgMzMuOTYzNlYzMiIgc3Ryb2tlPSIjM0YzRTNCIi8+CjxwYXRoIGQ9Ik0zOC4zODE4IDE4LjVMMzguMzgyIDE4LjVDMzguNDc0OCAxOC41IDM4LjU2NTggMTguNTI1OCAzOC42NDQ4IDE4LjU3NDdDMzguNzIzNyAxOC42MjM1IDM4Ljc4NzUgMTguNjkzNCAzOC44Mjg5IDE4Ljc3NjRMMzguODI5MSAxOC43NzY4TDQwLjgyOTEgMjIuNzc2OEw0MC44MjkyIDIyLjc3NjlDNDAuODY3MyAyMi44NTMgNDAuODg1MyAyMi45Mzc3IDQwLjg4MTQgMjMuMDIyOEM0MC44Nzc2IDIzLjEwNzkgNDAuODUyMSAyMy4xOTA2IDQwLjgwNzMgMjMuMjYzMUM0MC43NjI1IDIzLjMzNTYgNDAuNjk5OSAyMy4zOTU0IDQwLjYyNTUgMjMuNDM2OEM0MC41NTEgMjMuNDc4MyA0MC40NjczIDIzLjUgNDAuMzgyMSAyMy41SDQwLjM4MThIMzQuNUMzNC4zNjc0IDIzLjUgMzQuMjQwMiAyMy40NDczIDM0LjE0NjQgMjMuMzUzNkMzNC4wNTI3IDIzLjI1OTggMzQgMjMuMTMyNiAzNCAyM1YxOUMzNCAxOC44Njc0IDM0LjA1MjcgMTguNzQwMiAzNC4xNDY0IDE4LjY0NjRDMzQuMjQwMiAxOC41NTI3IDM0LjM2NzQgMTguNSAzNC41IDE4LjVIMzguMzgxOFoiIHN0cm9rZT0iIzNGM0UzQiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTM3IDM2QzM3IDM1LjgwMjIgMzYuOTQxNCAzNS42MDg5IDM2LjgzMTUgMzUuNDQ0NEMzNi43MjE2IDM1LjI4IDM2LjU2NTQgMzUuMTUxOCAzNi4zODI3IDM1LjA3NjFDMzYuMiAzNS4wMDA0IDM1Ljk5ODkgMzQuOTgwNiAzNS44MDQ5IDM1LjAxOTJDMzUuNjEwOSAzNS4wNTc4IDM1LjQzMjcgMzUuMTUzIDM1LjI5MjkgMzUuMjkyOUMzNS4xNTMgMzUuNDMyNyAzNS4wNTc4IDM1LjYxMDkgMzUuMDE5MiAzNS44MDQ5QzM0Ljk4MDYgMzUuOTk4OSAzNS4wMDA0IDM2LjIgMzUuMDc2MSAzNi4zODI3QzM1LjE1MTggMzYuNTY1NCAzNS4yOCAzNi43MjE2IDM1LjQ0NDQgMzYuODMxNUMzNS42MDg5IDM2Ljk0MTQgMzUuODAyMiAzNyAzNiAzN0MzNi4yNjUyIDM3IDM2LjUxOTYgMzYuODk0NiAzNi43MDcxIDM2LjcwNzFDMzYuODk0NiAzNi41MTk2IDM3IDM2LjI2NTIgMzcgMzZaIiBzdHJva2U9IiMzRjNFM0IiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyAzNkMxMyAzNS44MDIyIDEyLjk0MTQgMzUuNjA4OSAxMi44MzE1IDM1LjQ0NDRDMTIuNzIxNiAzNS4yOCAxMi41NjU0IDM1LjE1MTggMTIuMzgyNyAzNS4wNzYxQzEyLjIgMzUuMDAwNCAxMS45OTg5IDM0Ljk4MDYgMTEuODA0OSAzNS4wMTkyQzExLjYxMDkgMzUuMDU3OCAxMS40MzI3IDM1LjE1MyAxMS4yOTI5IDM1LjI5MjlDMTEuMTUzIDM1LjQzMjcgMTEuMDU3OCAzNS42MTA5IDExLjAxOTIgMzUuODA0OUMxMC45ODA2IDM1Ljk5ODkgMTEuMDAwNCAzNi4yIDExLjA3NjEgMzYuMzgyN0MxMS4xNTE4IDM2LjU2NTQgMTEuMjggMzYuNzIxNiAxMS40NDQ0IDM2LjgzMTVDMTEuNjA4OSAzNi45NDE0IDExLjgwMjIgMzcgMTIgMzdDMTIuMjY1MiAzNyAxMi41MTk2IDM2Ljg5NDYgMTIuNzA3MSAzNi43MDcxQzEyLjg5NDYgMzYuNTE5NiAxMyAzNi4yNjUyIDEzIDM2WiIgc3Ryb2tlPSIjM0YzRTNCIi8+CjxwYXRoIGQ9Ik02IDMySDRDMy40NDc3MiAzMiAzIDMxLjU1MjMgMyAzMUwzIDI5QzMgMjguNDQ3NyAzLjQ0NzcyIDI4IDQgMjhINkM2LjU1MjI4IDI4IDcgMjguNDQ3NyA3IDI5TDcgMzFDNyAzMS41NTIzIDYuNTUyMjggMzIgNiAzMloiIHN0cm9rZT0iIzNGM0UzQiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik00NCAzMkg0MkM0MS40NDc3IDMyIDQxIDMxLjU1MjMgNDEgMzFWMjlDNDEgMjguNDQ3NyA0MS40NDc3IDI4IDQyIDI4SDQ0QzQ0LjU1MjMgMjggNDUgMjguNDQ3NyA0NSAyOVYzMUM0NSAzMS41NTIzIDQ0LjU1MjMgMzIgNDQgMzJaIiBzdHJva2U9IiMzRjNFM0IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTEgMjNMMyAyMyIgc3Ryb2tlPSIjM0YzRTNCIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTEzIDE1TDMgMTUiIHN0cm9rZT0iIzNGM0UzQiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0xOCAxNUgxNiIgc3Ryb2tlPSIjM0YzRTNCIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTE2IDIzSDE0IiBzdHJva2U9IiMzRjNFM0IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTYgMTlMNyAxOSIgc3Ryb2tlPSIjM0YzRTNCIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTQgMTlIMiIgc3Ryb2tlPSIjM0YzRTNCIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIzNiIgcj0iNCIgc3Ryb2tlPSIjM0YzRTNCIi8+CjxjaXJjbGUgY3g9IjM2IiBjeT0iMzYiIHI9IjQiIHN0cm9rZT0iIzNGM0UzQiIvPgo8L3N2Zz4K',
  // Box / Origin Postado
  box: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQyIDI5Ljc4NTRWMTYuMjM2MUM0MiAxNS40Nzg1IDQxLjU3MiAxNC43ODYgNDAuODk0NCAxNC40NDcyTDI0Ljg5NDQgNi40NDcyMUMyNC4zMzE0IDYuMTY1NjkgMjMuNjY4NiA2LjE2NTY5IDIzLjEwNTYgNi40NDcyMUw3LjEwNTU3IDE0LjQ0NzJDNi40MjggMTQuNzg2IDYgMTUuNDc4NSA2IDE2LjIzNjFWMzEuNzYzOUM2IDMyLjUyMTUgNi40MjggMzMuMjE0IDcuMTA1NTcgMzMuNTUyOEwyMy4xMTU4IDQxLjU1NzlDMjMuNjczMSA0MS44MzY1IDI0LjMyODQgNDEuODM5NSAyNC44ODgyIDQxLjU2NkwyOS44NTI4IDM5LjE0MDIiIHN0cm9rZT0iIzNGM0UzQiIvPgo8cGF0aCBkPSJNMjQgNDJWMjQuNDVNMjQgMjQuNDVMNiAxNU0yNCAyNC40NUw0MiAxNSIgc3Ryb2tlPSIjM0YzRTNCIi8+CjxwYXRoIGQ9Ik0xMyAxMS43MjczTDMwLjY5MjMgMjAuODE4MlYyNy4zNjE5QzMwLjY5MjMgMjguMTEwMSAzMS40ODM5IDI4LjU5MzMgMzIuMTQ5MyAyOC4yNTEzTDM0LjkxNDEgMjYuODMwN0MzNS41ODA4IDI2LjQ4ODEgMzYgMjUuODAxNCAzNiAyNS4wNTE4VjE4LjA5MDlMMTguMzA3NyA5IiBzdHJva2U9IiMzRjNFM0IiLz4KPHBhdGggZD0iTTkgMzAuMzgyVjI2LjgwOUM5IDI2LjQzNzMgOS4zOTExNiAyNi4xOTU2IDkuNzIzNjEgMjYuMzYxOEwxMy40NDcyIDI4LjIyMzZDMTMuNzg2IDI4LjM5MyAxNCAyOC43MzkzIDE0IDI5LjExOFYzMi42OTFDMTQgMzMuMDYyNyAxMy42MDg4IDMzLjMwNDQgMTMuMjc2NCAzMy4xMzgyTDkuNTUyNzkgMzEuMjc2NEM5LjIxNCAzMS4xMDcgOSAzMC43NjA3IDkgMzAuMzgyWiIgc3Ryb2tlPSIjM0YzRTNCIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTMyLjcxNzcgMzcuNTg5NUwzMy4wNzEyIDM3Ljk0M0wzMy40MjQ4IDM3LjU4OTVMNDAuOTM1MiAzMC4wNzlDNDEuNTIxIDI5LjQ5MzMgNDIuNDcwNyAyOS40OTMzIDQzLjA1NjUgMzAuMDc5QzQzLjY0MjMgMzAuNjY0OCA0My42NDIzIDMxLjYxNDYgNDMuMDU2NSAzMi4yMDA0TDMzLjQyNDggNDEuODMyMUMzMy4yMjk1IDQyLjAyNzQgMzIuOTEyOSA0Mi4wMjc0IDMyLjcxNzcgNDEuODMyMUwyOC4wMzE0IDM3LjE0NTlDMjcuNDQ1NiAzNi41NjAxIDI3LjQ0NTYgMzUuNjEwNCAyOC4wMzE0IDM1LjAyNDZDMjguNjE3MiAzNC40Mzg4IDI5LjU2NjkgMzQuNDM4OCAzMC4xNTI3IDM1LjAyNDZMMzIuNzE3NyAzNy41ODk1WiIgc3Ryb2tlPSIjM0YzRTNCIi8+Cjwvc3ZnPgo=',
  // Flag / Received in Brazil
  flag: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iNC41IiB5PSI2LjUiIHdpZHRoPSIzIiBoZWlnaHQ9IjM1IiByeD0iMS41IiBzdHJva2U9IiMzRjNFM0IiLz4KPHBhdGggZD0iTTcuNSAzMi44MzY3VjguMTkyNDlDOS4wOTU3NiA2LjQ4NDE5IDExLjUzMDQgNi4wMDkgMTQuNTU0MyA2LjI0ODUxQzE3LjY1MzIgNi40OTM5OCAyMS4yMjg0IDcuNDc4MzEgMjQuODY3IDguNDgyMDdMMjQuODk5OCA4LjQ5MTExQzI4LjUwMDYgOS40ODQ0NCAzMi4xNjI5IDEwLjQ5NDcgMzUuMzY2OCAxMC43NDg1QzM4LjExNzUgMTAuOTY2NCA0MC42MzU0IDEwLjYzNTMgNDIuNSA5LjE2MzQ1VjMzLjgwNzdDNDAuOTA0MiAzNS41MTYgMzguNDY5NiAzNS45OTExIDM1LjQ0NTcgMzUuNzUxNkMzMi4zNDY4IDM1LjUwNjIgMjguNzcxNiAzNC41MjE4IDI1LjEzMyAzMy41MTgxTDI1LjEwMDIgMzMuNTA5QzIxLjQ5OTQgMzIuNTE1NyAxNy44MzcxIDMxLjUwNTQgMTQuNjMzMiAzMS4yNTE2QzExLjg4MjUgMzEuMDMzNyA5LjM2NDYyIDMxLjM2NDkgNy41IDMyLjgzNjdaIiBzdHJva2U9IiMzRjNFM0IiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyMSIgcj0iNS41IiB0cmFuc2Zvcm09InJvdGF0ZSg1LjE4Njk1IDI1IDIxKSIgc3Ryb2tlPSIjM0YzRTNCIi8+CjxwYXRoIGQ9Ik0xMS45MTQgMTkuODEyMkwyNS44NDg1IDExLjY1M0wzOC4wODYgMjIuMTg4TDI0LjE1MTUgMzAuMzQ3MkwxMS45MTQgMTkuODEyMloiIHN0cm9rZT0iIzNGM0UzQiIvPgo8cGF0aCBkPSJNMjkuNDA0NSAyMy4xODQ1QzI5LjUzNjMgMjMuNDI3MiAyOS44Mzk4IDIzLjUxNzEgMzAuMDgyNSAyMy4zODUzQzMwLjMyNTIgMjMuMjUzNiAzMC40MTUxIDIyLjk1IDMwLjI4MzMgMjIuNzA3M0wyOS40MDQ1IDIzLjE4NDVaTTE5Ljc3MjcgMTkuNDk1N0MyMS4yNzEyIDE5LjE0MjkgMjMuMDgyMSAxOC45NTUyIDI0LjgxMSAxOS40MDcxQzI2LjUxOTUgMTkuODUzNyAyOC4xODE1IDIwLjkzMjQgMjkuNDA0NSAyMy4xODQ1TDMwLjI4MzMgMjIuNzA3M0MyOC45MjU0IDIwLjIwNjcgMjcuMDMzNiAxOC45NTQ1IDI1LjA2MzkgMTguNDM5N0MyMy4xMTQ4IDE3LjkzMDEgMjEuMTIzMiAxOC4xNTA0IDE5LjU0MzUgMTguNTIyM0wxOS43NzI3IDE5LjQ5NTdaIiBmaWxsPSIjM0YzRTNCIi8+Cjwvc3ZnPgo=',
  // Document Send / Electronic customs notice
  document_send: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1IDI5TDM5LjQwNjkgMzQuMjA4MUM0MC4wMzc4IDM0Ljk1MzggNDAuMDM3OCAzNi4wNDYyIDM5LjQwNjkgMzYuNzkxOUwzNSA0MlYzOEgyNlYzM0gzNVYyOVoiIHN0cm9rZT0iIzNGM0UzQiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMzEuOTc0IDMzVjEwLjkyMzFMMjUuMTI0MyA0SDkuNzEyNDRDOS4yNTgyOCA0IDguODIyNzEgNC4xOTQ1IDguNTAxNTcgNC41NDA3M0M4LjE4MDQzIDQuODg2OTUgOC4wMDAwMiA1LjM1NjUyIDguMDAwMDIgNS44NDYxNUw4LjAyNjA3IDQwLjE1MzhDOC4wMjYwNyA0MC42NDM1IDguMjA2NDkgNDEuMTEzMSA4LjUyNzYzIDQxLjQ1OTNDOC44NDg3NyA0MS44MDU1IDkuMjg0MzMgNDIgOS43Mzg1IDQySDMwLjI4NzZDMzAuNzQxOCA0MiAzMS4xNzczIDQxLjgwNTUgMzEuNDk4NSA0MS40NTkzQzMxLjgxOTYgNDEuMTEzMSAzMiA0MC42NDM1IDMyIDQwLjE1MzhWMzgiIHN0cm9rZT0iIzNGM0UzQiIvPgo8cGF0aCBkPSJNMjUgNFY5QzI1IDEwLjEwNDYgMjUuODk1NCAxMSAyNyAxMUgzMiIgc3Ryb2tlPSIjM0YzRTNCIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHJlY3QgeD0iMTEuNSIgeT0iMTQuNSIgd2lkdGg9IjE3IiBoZWlnaHQ9IjIiIHJ4PSIxIiBzdHJva2U9IiMzRjNFM0IiLz4KPHJlY3QgeD0iMTEuNSIgeT0iMTkuNSIgd2lkdGg9IjE3IiBoZWlnaHQ9IjIiIHJ4PSIxIiBzdHJva2U9IiMzRjNFM0IiLz4KPHJlY3QgeD0iMTEuNSIgeT0iMjQuNSIgd2lkdGg9IjE3IiBoZWlnaHQ9IjIiIHJ4PSIxIiBzdHJva2U9IiMzRjNFM0IiLz4KPHJlY3QgeD0iMTEuNSIgeT0iMjkuNSIgd2lkdGg9IjEzIiBoZWlnaHQ9IjIiIHJ4PSIxIiBzdHJva2U9IiMzRjNFM0IiLz4KPHJlY3QgeD0iMTEuNSIgeT0iMzQuNSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjIiIHJ4PSIxIiBzdHJva2U9IiMzRjNFM0IiLz4KPC9zdmc+Cg==',
  // Document Check / Customs cleared & fee confirmed
  document_check: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI5IDQySDkuNzM4NDlDOS4yODQzMyA0MiA4Ljg0ODc3IDQxLjgwNTUgOC41Mjc2MyA0MS40NTkzQzguMjA2NDkgNDEuMTEzMSA4LjAyNjA3IDQwLjY0MzUgOC4wMjYwNyA0MC4xNTM4TDguMDAwMDEgNS44NDYxNUM4LjAwMDAxIDUuMzU2NTIgOC4xODA0MyA0Ljg4Njk1IDguNTAxNTcgNC41NDA3M0M4LjgyMjcxIDQuMTk0NSA5LjI1ODI3IDQgOS43MTI0NCA0SDI1LjEyNDNMMzEuOTc0IDEwLjkyMzFWMzguNSIgc3Ryb2tlPSIjM0YzRTNCIi8+CjxwYXRoIGQ9Ik0yNSA0VjlDMjUgMTAuMTA0NiAyNS44OTU0IDExIDI3IDExSDMyIiBzdHJva2U9IiMzRjNFM0IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cmVjdCB4PSIxMS41IiB5PSIxNC41IiB3aWR0aD0iMTciIGhlaWdodD0iMiIgcng9IjEiIHN0cm9rZT0iIzNGM0UzQiIvPgo8cmVjdCB4PSIxMS41IiB5PSIxOS41IiB3aWR0aD0iMTciIGhlaWdodD0iMiIgcng9IjEiIHN0cm9rZT0iIzNGM0UzQiIvPgo8cmVjdCB4PSIxMS41IiB5PSIyNC41IiB3aWR0aD0iMTciIGhlaWdodD0iMiIgcng9IjEiIHN0cm9rZT0iIzNGM0UzQiIvPgo8cmVjdCB4PSIxMS41IiB5PSIyOS41IiB3aWR0aD0iMTciIGhlaWdodD0iMiIgcng9IjEiIHN0cm9rZT0iIzNGM0UzQiIvPgo8cmVjdCB4PSIxMS41IiB5PSIzNC41IiB3aWR0aD0iMTAiIGhlaWdodD0iMiIgcng9IjEiIHN0cm9rZT0iIzNGM0UzQiIvPgo8cGF0aCBkPSJNMzAuNDU0IDM5LjI3ODJMMzAuODA3NiAzOS42MzE4TDMxLjE2MTEgMzkuMjc4MkwzOC42NzE2IDMxLjc2NzhDMzkuMjU3MyAzMS4xODIgNDAuMjA3MSAzMS4xODIgNDAuNzkyOSAzMS43Njc4QzQxLjM3ODcgMzIuMzUzNiA0MS4zNzg3IDMzLjMwMzMgNDAuNzkyOSAzMy44ODkxTDMxLjE2MTEgNDMuNTIwOEMzMC45NjU5IDQzLjcxNjEgMzAuNjQ5MyA0My43MTYxIDMwLjQ1NCA0My41MjA4TDI1Ljc2NzggMzguODM0NkMyNS4xODIgMzguMjQ4OCAyNS4xODIgMzcuMjk5MSAyNS43Njc4IDM2LjcxMzNDMjYuMzUzNiAzNi4xMjc1IDI3LjMwMzMgMzYuMTI3NSAyNy44ODkxIDM2LjcxMzNMMzAuNDU0IDM5LjI3ODJaIiBzdHJva2U9IiMzRjNFM0IiLz4KPC9zdmc+Cg==',
  // Correios Ribbon Logo for customs/brand steps
  correios: '/correios-icon.png',
  document_alert: '/correios-icon.png'
};

// Inject timeline CSS styles matching result-template.html
const CSS = `
.ship-steps { list-style: none; margin: 0; padding: 0; border-left: none !important; margin-left: 20px; }
.ship-steps .step { display: flex; padding-bottom: 0px; position: relative; }
.step-content { margin-left: 30px; padding-bottom: 20px; }
.text { width: 100%; text-align: left; margin-top: 0; margin-bottom: 0; }
.text-head { font-size: .96rem; font-weight: bold; color: #00416b; }
.text-content { font-size: .9rem; font-weight: normal; color: #222; }
.arrow-current { height: auto; border-right: 2.5px solid #ffc40c; width: 22px; position: relative; }
.ship-steps .step:last-child .arrow-current { border-right: none !important; }
.circle {
  background-color: #ddd;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  overflow: hidden;
  position: relative;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box;
}
.circle .circle-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: invert(24%) sepia(69%) saturate(2298%) hue-rotate(181deg) brightness(90%) contrast(101%);
  display: block;
}
.circle .circle-img.correios-logo {
  filter: none !important;
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.step-alert-box { background: #fff3cd; border-left: 3px solid #ffc107; padding: 6px 10px; margin: 6px 0; font-size: 0.85rem; color: #856404; font-weight: 600; }

/* ==========================================================================
   TIMELINE CUSTOMS ACTION HYPERLINK
   ========================================================================== */
.customs-action-container {
  margin-top: 8px;
  display: block;
}
.customs-action-link {
  color: #005691 !important;
  font-size: 0.92rem !important;
  font-weight: 700 !important;
  text-decoration: underline !important;
  cursor: pointer !important;
  display: inline-block !important;
  line-height: 1.4 !important;
  transition: color 0.15s ease !important;
}
.customs-action-link:hover {
  color: #002e4d !important;
  text-decoration: underline !important;
}

/* ==========================================================================
   CUSTOMS MODAL (CLEAN, MINIMALIST, HIGH CONTRAST)
   ========================================================================== */
.customs-modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 37, 64, 0.68);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  z-index: 9999999;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}
.customs-modal-box {
  background: #ffffff;
  border-radius: 6px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
  border-top: 4px solid #ffc40c;
  overflow: hidden;
  position: relative;
  animation: customsModalAnim 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}
@keyframes customsModalAnim {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.customs-modal-header {
  padding: 18px 22px 14px 22px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: #ffffff;
}
.customs-modal-title-group {
  flex: 1;
}
.customs-modal-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 3px 8px;
  border-radius: 3px;
  background: #fef3c7;
  color: #92400e;
  margin-bottom: 6px;
}
.customs-modal-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #00416b;
  margin: 0;
  line-height: 1.3;
}
.customs-modal-close {
  background: transparent !important;
  border: none !important;
  font-size: 1.8rem !important;
  color: #64748b !important;
  cursor: pointer !important;
  padding: 0 6px !important;
  margin-left: 12px !important;
  line-height: 1 !important;
  transition: color 0.15s !important;
}
.customs-modal-close:hover {
  color: #00416b !important;
}
.customs-modal-body {
  padding: 20px 22px;
  max-height: calc(85vh - 120px);
  overflow-y: auto;
  box-sizing: border-box;
}
.customs-modal-desc {
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 16px 0;
}
.customs-fee-card {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 4px;
  padding: 14px 16px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.customs-fee-label {
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.customs-fee-amount {
  font-size: 1.45rem;
  font-weight: 800;
  color: #00416b;
}
.customs-fee-meta {
  text-align: right;
}
.customs-fee-due {
  font-size: 0.74rem;
  font-weight: 600;
  color: #64748b;
}
.customs-fee-pix {
  font-size: 0.76rem;
  font-weight: 700;
  color: #00874e;
}

/* Primary High-Contrast Pay Button (Correios Yellow with Deep Blue Text) */
.btn-customs-pay-main {
  width: 100% !important;
  min-height: 48px !important;
  height: auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  padding: 13px 20px !important;
  background: #ffc40c !important;
  color: #00416b !important;
  border: 1px solid #e5b00b !important;
  border-radius: 4px !important;
  font-size: 0.95rem !important;
  font-weight: 800 !important;
  cursor: pointer !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08) !important;
  transition: all 0.15s ease !important;
  text-decoration: none !important;
  box-sizing: border-box !important;
  margin-top: 6px !important;
  line-height: normal !important;
  overflow: visible !important;
  white-space: normal !important;
}
.btn-customs-pay-main:hover {
  background: #f0b70a !important;
  color: #002e4d !important;
  box-shadow: 0 3px 6px rgba(0,0,0,0.12) !important;
}
.btn-customs-pay-main span {
  color: #00416b !important;
  font-size: 0.95rem !important;
  font-weight: 800 !important;
  line-height: normal !important;
}
.btn-customs-pay-main svg {
  color: #00416b !important;
  stroke: #00416b !important;
  min-width: 18px !important;
  min-height: 18px !important;
  display: inline-block !important;
}

/* Pix Container inside Modal */
.customs-pix-container {
  display: none;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 16px;
  margin-top: 14px;
  text-align: center;
  box-sizing: border-box;
}
.customs-pix-qr {
  width: 180px;
  height: 180px;
  display: block;
  margin: 0 auto 12px auto;
  background: #ffffff;
  padding: 4px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}
.customs-pix-code-field {
  width: 100% !important;
  padding: 9px 12px !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 4px !important;
  font-family: monospace !important;
  font-size: 0.8rem !important;
  background: #ffffff !important;
  color: #1e293b !important;
  margin-bottom: 10px !important;
  box-sizing: border-box !important;
}
.btn-customs-copy {
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  padding: 10px 16px !important;
  background: #00416b !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 0.88rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: background 0.15s !important;
  margin-bottom: 10px !important;
  box-sizing: border-box !important;
}
.btn-customs-copy:hover {
  background: #002e4d !important;
}
.btn-customs-confirm {
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 11px 16px !important;
  background: #00874e !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 0.9rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: background 0.15s !important;
  box-sizing: border-box !important;
}
.btn-customs-confirm:hover {
  background: #006b3e !important;
}
`;
(function(){
  const s = document.createElement('style');
  s.textContent = CSS;
  document.head.appendChild(s);
})();

function step(head, content, extra, iconKey = 'box'){
  const isCorreios = (iconKey === 'correios' || iconKey === 'document_alert' || iconKey === 'customs');
  const iconSrc = isCorreios ? (API_BASE ? `${API_BASE}/correios-icon.png` : '/correios-icon.png') : (ICONS[iconKey] || ICONS.box);
  const imgClass = isCorreios ? 'circle-img correios-logo' : 'circle-img';
  return `
    <li class="step">
      <div class="arrow-current">
        <div class="circle">
          <img class="${imgClass}" src="${iconSrc}" alt="Status">
        </div>
      </div>
      <div class="step-content">
        <p class="text text-head">${head}</p>
        ${extra ? `<div class="step-alert-box">${extra}</div>` : ''}
        <p class="text text-content">${content}</p>
      </div>
    </li>
  `;
}

function renderCustomsModal(d) {
  let modal = document.getElementById('customs-modal-overlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'customs-modal-overlay';
    modal.className = 'customs-modal-overlay';
    document.body.appendChild(modal);
  }

  if (!d.customs || d.customs.status !== 'pending_payment') {
    modal.style.display = 'none';
    modal.innerHTML = '';
    return;
  }

  const c = d.customs;
  const feeFormatted = (c.fee || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  modal.innerHTML = `
    <div class="customs-modal-box" onclick="event.stopPropagation()">
      <div class="customs-modal-header">
        <div class="customs-modal-title-group">
          <span class="customs-modal-badge">Aviso da Fiscalização Aduaneira</span>
          <h3 class="customs-modal-title">${c.title || 'Taxa de Despacho Aduaneiro / Receita Federal'}</h3>
        </div>
        <button type="button" class="customs-modal-close" onclick="closeCustomsModal()" title="Fechar">×</button>
      </div>

      <div class="customs-modal-body">
        <p class="customs-modal-desc">
          O seu objeto foi selecionado para conferência aduaneira no <strong>Centro Internacional de Curitiba / PR</strong>.
          De acordo com as normas da Receita Federal, é necessário efetuar o pagamento do tributo de importação / despacho para que a encomenda seja liberada para entrega.
        </p>

        <div class="customs-fee-card">
          <div>
            <div class="customs-fee-label">Valor da Taxa a Pagar</div>
            <div class="customs-fee-amount">R$ ${feeFormatted}</div>
          </div>
          <div class="customs-fee-meta">
            <div class="customs-fee-due">Vencimento: Imediato</div>
            <div class="customs-fee-pix">Compensação Instantânea via Pix</div>
          </div>
        </div>

        <button type="button" class="btn-customs-pay-main" id="btn-show-pix" onclick="togglePixDrawer()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span id="btn-pay-text">Pagar Taxa via Pix (Gerar QR Code)</span>
        </button>

        <div class="customs-pix-container" id="customs-pix-container" style="display: none;">
          <p style="font-size: 0.85rem; font-weight: 700; color: #00416b; margin-top: 0; margin-bottom: 12px;">
            Escaneie o QR Code no app do seu banco ou use o Pix Copia e Cola:
          </p>
          <img src="${c.pixQrCode}" alt="QR Code Pix" class="customs-pix-qr">
          
          <div style="text-align: left; margin-bottom: 4px;">
            <label style="font-size: 0.74rem; font-weight: 700; color: #64748b;">Código Pix Copia e Cola:</label>
          </div>
          <input type="text" readonly value="${c.pixCode}" id="pix-copy-input" class="customs-pix-code-field">
          
          <button type="button" class="btn-customs-copy" onclick="copyPixPayload()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span id="btn-copy-text">Copiar Código Pix</span>
          </button>

          <button type="button" class="btn-customs-confirm" id="btn-confirm-pay" onclick="submitCustomsPayment('${d.trackingCode}')">
            Já Efetuei o Pagamento via Pix
          </button>
          
          <p style="font-size: 0.72rem; color: #64748b; margin-top: 10px; margin-bottom: 0;">
            A liberação aduaneira ocorre no sistema logo após a confirmação do pagamento.
          </p>
        </div>
      </div>
    </div>
  `;

  modal.onclick = (e) => {
    if (e.target === modal) closeCustomsModal();
  };
}

let activeTrackingCode = '';
let customsPollTimer = null;

function startCustomsPolling(code) {
  stopCustomsPolling();
  if (!code) return;
  customsPollTimer = setInterval(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tracking/${encodeURIComponent(code)}/customs-status`);
      if (res.ok) {
        const data = await res.json();
        if (data.isPaid || data.customsStatus === 'paid') {
          stopCustomsPolling();
          closeCustomsModal();
          alert('✅ Pagamento da taxa alfandegária confirmado! O objeto foi desembaraçado e liberado para entrega.');
          await consultarCodigo(code);
        }
      }
    } catch (_) {}
  }, 6000);
}

function stopCustomsPolling() {
  if (customsPollTimer) {
    clearInterval(customsPollTimer);
    customsPollTimer = null;
  }
}

function openCustomsModal() {
  const modal = document.getElementById('customs-modal-overlay');
  if (modal) {
    modal.style.display = 'flex';
    if (activeTrackingCode) {
      startCustomsPolling(activeTrackingCode);
    }
  }
}

function closeCustomsModal() {
  stopCustomsPolling();
  const modal = document.getElementById('customs-modal-overlay');
  if (modal) {
    modal.style.display = 'none';
  }
}

function render(d){
  let box = document.getElementById('tabs-rastreamento');
  if(!box){
    box = document.createElement('div');
    box.id = 'tabs-rastreamento';
    const container = document.querySelector('main .container') || document.querySelector('.container') || document.body;
    container.appendChild(box);
  }
  box.innerHTML = '';

  const destCity = d.city || d.customerCity || 'Destino';
  const destCep = d.cep ? `(CEP ${d.cep})` : '';
  const code = d.trackingCode || '';
  activeTrackingCode = code;

  // Render header
  const headerHtml = `
    <div style="padding: 16px 0 12px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 18px;">
      <p class="text text-head" style="color: #00416b; font-size: 1.15rem; font-weight: 800;">${code}</p>
      <p class="text text-content" style="color: #64748b; font-size: 0.92rem; margin-top: 2px;">
        Destino: <strong>${destCity}</strong> ${destCep} • <strong>${d.status || 'Em trânsito'}</strong>
      </p>
    </div>
  `;

  let stepsHtml = '';
  const isCustomsPending = d.customs && d.customs.status === 'pending_payment';

  // If rich timeline is provided by backend
  if (d.timeline && Array.isArray(d.timeline) && d.timeline.length > 0) {
    stepsHtml = d.timeline.map(item => {
      const isCustomsEvent = item.hasCustomsAction || (isCustomsPending && (
        (item.title && (item.title.toLowerCase().includes('aduaneir') || item.title.toLowerCase().includes('tributo') || item.title.toLowerCase().includes('alfandegár') || item.title.toLowerCase().includes('receita'))) ||
        (item.location && (item.location.toLowerCase().includes('fiscalização') || item.location.toLowerCase().includes('posto fiscal')))
      ));

      let iconType = 'truck';
      if (isCustomsEvent || item.icon === 'correios' || item.icon === 'document_alert') {
        iconType = 'correios';
      } else if (item.icon && ICONS[item.icon]) {
        iconType = item.icon;
      } else if (item.icon === 'check' || (item.title && item.title.toLowerCase().includes('entregue'))) {
        iconType = 'check';
      } else if (item.icon === 'box' || (item.title && item.title.toLowerCase().includes('postado'))) {
        iconType = 'box';
      }

      let actionLinkHtml = '';
      if (isCustomsPending && isCustomsEvent) {
        actionLinkHtml = `
          <div class="customs-action-container">
            <a href="javascript:void(0)" onclick="openCustomsModal()" class="customs-action-link">
              Realizar pagamento da taxa alfandegária. Clique aqui para realizar o pagamento
            </a>
          </div>
        `;
      }

      const locationText = item.location ? `${item.location} — ${item.date}` : item.date;
      return step(item.title, `${item.detail ? item.detail + '<br>' : ''}${locationText}${actionLinkHtml}`, item.alert || '', iconType);
    }).join('');
  } else {
    // Fallback progression
    const d0 = new Date(d.createdAt || Date.now()).toLocaleDateString('pt-BR');
    const steps = [
      step('Objeto postado', `${ORIGIN} — ${d0} 14:30`, null, 'box')
    ];
    if (isCustomsPending) {
      steps.push(step('Aguardando pagamento do despacho aduaneiro / tributo de importação', `Curitiba, PR (Fiscalização Aduaneira) — ${d0} 18:30<div class="customs-action-container"><a href="javascript:void(0)" onclick="openCustomsModal()" class="customs-action-link">Realizar pagamento da taxa alfandegária. Clique aqui para realizar o pagamento</a></div>`, null, 'correios'));
    } else {
      if (d.day >= 1) {
        steps.push(step('Objeto em trânsito - por favor aguarde', `${ORIGIN} → ${destCity} — ${d0} 17:45`, null, 'truck'));
      }
      if (d.day >= 6) {
        steps.push(step('Objeto saiu para entrega ao destinatário', `${destCity} — ${d0} 09:15`, 'É preciso ter alguém no endereço para receber o carteiro', 'truck'));
      }
      if (d.status === 'Entregue' || d.day >= 9) {
        steps.push(step('Objeto entregue ao destinatário.', `${destCity} — ${d0} 15:20`, null, 'check'));
      }
    }
    stepsHtml = steps.reverse().join('');
  }

  // Render minimalist timeline without giant intrusive card
  box.innerHTML = headerHtml + `<ul class="ship-steps">${stepsHtml}</ul>`;
  
  // Render customs modal in background ready for trigger
  renderCustomsModal(d);

  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function togglePixDrawer() {
  const drawer = document.getElementById('customs-pix-container') || document.getElementById('pix-drawer');
  if (!drawer) return;
  const isHidden = drawer.style.display === 'none' || !drawer.style.display;
  drawer.style.display = isHidden ? 'block' : 'none';
  const textSpan = document.getElementById('btn-pay-text');
  if (textSpan) {
    textSpan.textContent = isHidden ? 'Ocultar Detalhes do Pagamento Pix' : 'Pagar Taxa via Pix (Gerar QR Code)';
  }
}

function copyPixPayload() {
  const input = document.getElementById('pix-copy-input');
  if (!input) return;
  input.select();
  navigator.clipboard.writeText(input.value);
  alert('Código Pix Copia e Cola copiado para a área de transferência! Abra o aplicativo do seu banco para colar e pagar.');
}

async function submitCustomsPayment(code) {
  const btn = document.getElementById('btn-confirm-pay');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Verificando pagamento junto à Receita / Gateway...';
  }

  try {
    const res = await fetch(`${API_BASE}/api/tracking/${encodeURIComponent(code)}/pay-customs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (data.ok && data.paid) {
      stopCustomsPolling();
      closeCustomsModal();
      alert('✅ Pagamento da taxa alfandegária confirmado com sucesso! O objeto foi liberado pela autoridade aduaneira e seguirá para entrega.');
      // Refresh tracking view to show unlocked progression
      await consultarCodigo(code);
    } else {
      alert(data.message || 'O pagamento via Pix ainda não foi confirmado pelo sistema bancário. Se você já transferiu o Pix, aguarde cerca de 1 a 2 minutos para compensação e clique novamente.');
    }
  } catch (e) {
    alert('Erro ao confirmar pagamento aduaneiro: ' + e.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Já Efetuei o Pagamento via Pix';
    }
  }
}

async function consultarCodigo(codeToSearch) {
  const code = (codeToSearch || document.getElementById('objeto')?.value || '').trim().toUpperCase();
  if (!code) return;

  const btn = document.getElementById('b-pesquisar');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Consultando...';
  }

  const input = document.getElementById('objeto');
  if (input) input.value = code;

  try {
    const r = await fetch(`${API}/${encodeURIComponent(code)}`);
    if (!r.ok) throw new Error('Não encontrado');
    const data = await r.json();
    render(data);
  } catch (e) {
    alert(`Objeto "${code}" não encontrado. Verifique o código e tente novamente.`);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Consultar';
    }
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('b-pesquisar');
  if (btn) {
    btn.addEventListener('click', () => consultarCodigo());
  }

  const input = document.getElementById('objeto');
  if (input) {
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        consultarCodigo();
      }
    });
  }

  // Auto-detect code from URL path or query params
  // Supports:
  // 1. /rastreio/BR013101007BR
  // 2. /BR013101007BR (quando a página de rastreio está na raiz de um domínio dedicado)
  // 3. ?objeto=BR... ou ?codigo=... ou ?c=... ou ?track=...
  let urlCode = '';
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts.length >= 2 && pathParts[0] === 'rastreio') {
    urlCode = pathParts[1];
  } else if (pathParts.length === 1 && /^[A-Z0-9]{9,15}$/i.test(pathParts[0])) {
    urlCode = pathParts[0];
  }
  if (!urlCode) {
    const params = new URLSearchParams(window.location.search);
    urlCode = params.get('objeto') || params.get('codigo') || params.get('c') || params.get('track') || '';
  }

  if (urlCode) {
    consultarCodigo(urlCode);
  }
});
