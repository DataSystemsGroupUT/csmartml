FROM python:3

WORKDIR /main

COPY dependencies.txt ./
RUN pip install --no-cache-dir -r dependencies.txt

COPY . .

CMD [ "python", "./main/sse.py" ]